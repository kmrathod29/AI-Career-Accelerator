import api from './api.js'

function requestError(error) {
	const status = error?.response?.status
	if (status === 401 || status === 403) return new Error('Your session has expired. Please sign in again.')
	if (status === 503) return new Error('The AI coach is temporarily unavailable. Please try again shortly.')
	if (status >= 500) return new Error('The server could not complete this request. Please try again.')
	if (status === 400) return new Error(error?.response?.data?.message || 'Please check your message and try again.')
	if (error?.code === 'ECONNABORTED') return new Error('The request took too long. Please try again.')
	if (!error?.response) return new Error('Unable to reach the server. Check your connection and try again.')
	return new Error(error?.response?.data?.message || 'The request could not be completed. Please try again.')
}

function responseData(response) {
	if (!response || response.success !== true || !response.data || typeof response.data !== 'object') {
		throw new Error('The server returned an invalid response. Please try again.')
	}
	return response.data
}

function normalizeMessage(message) {
	if (!message || typeof message !== 'object' || typeof message.id !== 'string' || !message.id ||
		!['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
		throw new Error('A conversation message could not be displayed. Reload this conversation to try again.')
	}
	return {
		id: message.id,
		role: message.role,
		content: message.content,
		createdAt: typeof message.createdAt === 'string' ? message.createdAt : null,
	}
}

function normalizeConversation(conversation) {
	if (!conversation || typeof conversation !== 'object' || typeof conversation.id !== 'string' || !conversation.id) {
		throw new Error('The server returned an invalid conversation. Please try again.')
	}
	return {
		id: conversation.id,
		title: typeof conversation.title === 'string' ? conversation.title : 'Untitled conversation',
		createdAt: typeof conversation.createdAt === 'string' ? conversation.createdAt : null,
		updatedAt: typeof conversation.updatedAt === 'string' ? conversation.updatedAt : null,
	}
}

async function request(callback) {
	try {
		return await callback()
	} catch (error) {
		if (error instanceof Error && !error?.response) throw error
		throw requestError(error)
	}
}

export const coachApi = {
	async getConversations() {
		return request(async () => {
			const result = responseData((await api.get('/coach/conversations')).data)
			if (!Array.isArray(result.conversations)) throw new Error('The server returned an invalid conversation list.')
			return result.conversations.map(normalizeConversation)
		})
	},

	async createConversation() {
		return request(async () => normalizeConversation(
			responseData((await api.post('/coach/conversations')).data).conversation,
		))
	},

	async getConversation(id) {
		return request(async () => {
			const conversation = responseData((await api.get(`/coach/conversations/${id}`)).data).conversation
			const normalized = normalizeConversation(conversation)
			if (!Array.isArray(conversation.messages)) throw new Error('The server returned an invalid message list.')
			return { ...normalized, messages: conversation.messages.map(normalizeMessage) }
		})
	},

	async sendMessage(conversationId, message, requestId) {
		return request(async () => {
			const data = responseData((await api.post(
				`/coach/conversations/${conversationId}/messages`,
				{ message, requestId },
				{ timeout: 90000 },
			)).data)
			const userMessage = normalizeMessage(data.userMessage)
			const assistantMessage = normalizeMessage(data.assistantMessage)
			if (userMessage.role !== 'user' || assistantMessage.role !== 'assistant') {
				throw new Error('The server returned an invalid chat response. Please try again.')
			}
			return {
				userMessage,
				assistantMessage,
				conversationTitle: typeof data.conversationTitle === 'string' ? data.conversationTitle : null,
			}
		})
	},

	async deleteConversation(id) {
		return request(async () => {
			responseData((await api.delete(`/coach/conversations/${id}`)).data)
			return true
		})
	},
}
