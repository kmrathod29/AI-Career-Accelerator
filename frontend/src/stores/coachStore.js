import { useSyncExternalStore } from 'react'
import { coachApi } from '@/services/coachApi.js'

function createDefaultState() {
	return {
		conversations: [],
		isLoadingConversations: false,
		activeConversationId: null,
		messages: [],
		messagesByConversation: {},
		isLoadingMessages: false,
		isSending: false,
		draft: '',
		error: null,
		sendError: null,
	}
}

function normalizeState(current = {}) {
	const defaults = createDefaultState()
	const conversationMessages = current.messagesByConversation
	return {
		...defaults,
		...current,
		conversations: Array.isArray(current.conversations) ? current.conversations : [],
		messages: Array.isArray(current.messages) ? current.messages : [],
		messagesByConversation: conversationMessages && typeof conversationMessages === 'object' && !Array.isArray(conversationMessages)
			? conversationMessages
			: {},
	}
}

let state = normalizeState()
const listeners = new Set()
const pendingSends = new Set()
const deletedConversations = new Set()
const retryRequestIds = new Map()
let conversationsRequestId = 0
let historyRequestId = 0
let tempMessageId = 0
let sessionVersion = 0

function emit() {
	listeners.forEach((listener) => listener())
}

function setState(updater) {
	const current = normalizeState(state)
	const patch = typeof updater === 'function' ? updater(current) : updater
	state = normalizeState({ ...current, ...patch })
	emit()
}

function replaceOptimisticMessage(messages, tempId, userMessage, assistantMessage) {
	const withoutOptimistic = messages.filter((message) => message.id !== tempId)
	const ids = new Set(withoutOptimistic.map((message) => message.id))
	if (!ids.has(userMessage.id)) withoutOptimistic.push(userMessage)
	if (!ids.has(assistantMessage.id)) withoutOptimistic.push(assistantMessage)
	return withoutOptimistic
}

export const coachStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getSnapshot() {
		if (!Array.isArray(state.conversations) || !Array.isArray(state.messages) ||
			!state.messagesByConversation || typeof state.messagesByConversation !== 'object' || Array.isArray(state.messagesByConversation)) {
			state = normalizeState(state)
		}
		return state
	},

	async loadConversations() {
		const requestId = ++conversationsRequestId
		setState({ isLoadingConversations: true, error: null })
		try {
			const conversations = await coachApi.getConversations()
			if (requestId !== conversationsRequestId) return
			setState({ conversations, isLoadingConversations: false })
		} catch (error) {
			console.error('loadConversations error:', error)
			if (requestId === conversationsRequestId) {
				setState({ isLoadingConversations: false, error: error.message })
			}
		}
	},

	async createConversation() {
		const version = sessionVersion
		++conversationsRequestId
		setState({ error: null })
		try {
			const conversation = await coachApi.createConversation()
			if (version !== sessionVersion) return null
			deletedConversations.delete(conversation.id)
			++historyRequestId
			setState((current) => ({
				conversations: [conversation, ...current.conversations.filter((item) => item.id !== conversation.id)],
				activeConversationId: conversation.id,
				messages: [],
				messagesByConversation: { ...current.messagesByConversation, [conversation.id]: [] },
				isLoadingMessages: false,
				isLoadingConversations: false,
				isSending: pendingSends.has(conversation.id),
				sendError: null,
				error: null,
				draft: '',
			}))
			return conversation
		} catch (error) {
			console.error('createConversation error:', error)
			if (version !== sessionVersion) return null
			setState({ error: error.message })
			return null
		}
	},

	async openConversation(id) {
		if (typeof id !== 'string' || !id) return
		if (state.activeConversationId === id && !state.isLoadingMessages && !state.error) return

		const requestId = ++historyRequestId
		const cachedMessages = normalizeState(state).messagesByConversation[id]
		setState(() => ({
			activeConversationId: id,
			messages: cachedMessages ?? [],
			isLoadingMessages: true,
			isSending: pendingSends.has(id),
			error: null,
			sendError: null,
			draft: '',
		}))

		try {
			const conversation = await coachApi.getConversation(id)
			if (requestId !== historyRequestId || state.activeConversationId !== id) return
			setState((current) => {
				const messages = current.messagesByConversation[id] ?? conversation.messages
				return {
					messages,
					messagesByConversation: { ...current.messagesByConversation, [id]: messages },
					isLoadingMessages: false,
				}
			})
		} catch (error) {
			console.error('openConversation error:', error)
			if (requestId === historyRequestId && state.activeConversationId === id) {
				setState({ isLoadingMessages: false, error: error.message })
			}
		}
	},

	closeConversation() {
		++historyRequestId
		setState({
			activeConversationId: null,
			messages: [],
			isLoadingMessages: false,
			isSending: false,
			error: null,
			sendError: null,
			draft: '',
		})
	},

	setDraft(value) {
		setState({ draft: typeof value === 'string' ? value : '' })
	},

	async sendMessage(messageOverride) {
		const conversationId = state.activeConversationId
		const draft = typeof messageOverride === 'string' ? messageOverride : state.draft
		const message = draft.trim()
		if (!message || !conversationId || state.isLoadingMessages || pendingSends.has(conversationId)) return false
		if (message.length > 4000) {
			setState({ sendError: 'Messages must be 4,000 characters or fewer.' })
			return false
		}

		const tempId = `temp-${Date.now()}-${++tempMessageId}`
		const version = sessionVersion
		let requestId = retryRequestIds.get(conversationId)?.message === message
			? retryRequestIds.get(conversationId).requestId
			: null
		if (!requestId) {
			requestId = globalThis.crypto?.randomUUID?.() || `coach-${Date.now()}-${tempMessageId}`
			retryRequestIds.set(conversationId, { message, requestId })
		}
		const tempMessage = { id: tempId, role: 'user', content: message, createdAt: new Date().toISOString() }
		pendingSends.add(conversationId)
		setState((current) => {
			const messages = [...(current.messagesByConversation[conversationId] ?? current.messages), tempMessage]
			return {
				messages,
				messagesByConversation: { ...current.messagesByConversation, [conversationId]: messages },
				isSending: current.activeConversationId === conversationId,
				draft: current.activeConversationId === conversationId ? '' : current.draft,
				sendError: null,
			}
		})

		try {
			const { userMessage, assistantMessage, conversationTitle } = await coachApi.sendMessage(conversationId, message, requestId)
			if (version === sessionVersion) retryRequestIds.delete(conversationId)
			if (version === sessionVersion && !deletedConversations.has(conversationId)) {
				++conversationsRequestId
				setState((current) => {
					const existing = current.messagesByConversation[conversationId] ?? []
					const messages = replaceOptimisticMessage(existing, tempId, userMessage, assistantMessage)
					const conversations = current.conversations.map((item) => item.id === conversationId
						? { ...item, ...(conversationTitle ? { title: conversationTitle } : {}), updatedAt: assistantMessage.createdAt }
						: item)
					return {
						conversations,
						isLoadingConversations: false,
						messagesByConversation: { ...current.messagesByConversation, [conversationId]: messages },
						...(current.activeConversationId === conversationId ? { messages, sendError: null } : {}),
					}
				})
			}
			return true
		} catch (error) {
			console.error('sendMessage error:', error)
			if (version !== sessionVersion || deletedConversations.has(conversationId)) return false
			setState((current) => {
				const messages = (current.messagesByConversation[conversationId] ?? []).filter((item) => item.id !== tempId)
				return {
					messagesByConversation: { ...current.messagesByConversation, [conversationId]: messages },
					...(current.activeConversationId === conversationId ? {
						messages,
						draft: current.draft || message,
						sendError: error.message,
					} : {}),
				}
			})
			return false
		} finally {
			pendingSends.delete(conversationId)
			if (version === sessionVersion && state.activeConversationId === conversationId) setState({ isSending: false })
		}
	},

	clearSendError() {
		setState({ sendError: null })
	},

	async deleteConversation(id) {
		const version = sessionVersion
		try {
			await coachApi.deleteConversation(id)
			if (version !== sessionVersion) return { success: false, message: 'Your session changed. Please try again.' }
			deletedConversations.add(id)
			retryRequestIds.delete(id)
			++conversationsRequestId
			if (state.activeConversationId === id) ++historyRequestId
			setState((current) => {
				const messagesByConversation = Object.fromEntries(
					Object.entries(current.messagesByConversation).filter(([conversationId]) => conversationId !== id),
				)
				const wasActive = current.activeConversationId === id
				return {
					conversations: current.conversations.filter((item) => item.id !== id),
					isLoadingConversations: false,
					messagesByConversation,
					...(wasActive ? {
						activeConversationId: null,
						messages: [],
						isLoadingMessages: false,
						isSending: false,
						sendError: null,
						draft: '',
				} : {}),
				}
			})
			return { success: true }
		} catch (error) {
			console.error('deleteConversation error:', error)
			if (version !== sessionVersion) return { success: false, message: 'Your session changed. Please try again.' }
			return { success: false, message: error.message }
		}
	},

	reset() {
		++sessionVersion
		++conversationsRequestId
		++historyRequestId
		pendingSends.clear()
		deletedConversations.clear()
		retryRequestIds.clear()
		setState(createDefaultState())
	},
}

export function useCoachStore(selector) {
	return useSyncExternalStore(
		coachStore.subscribe.bind(coachStore),
		() => selector(coachStore.getSnapshot()),
	)
}
