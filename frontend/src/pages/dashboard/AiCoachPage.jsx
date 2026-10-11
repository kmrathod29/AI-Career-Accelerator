import { Component, useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
	AlertCircle,
	AlertTriangle,
	Bot,
	ChevronLeft,
	Loader2,
	Plus,
	RefreshCw,
	Send,
	Trash2,
	MessageSquare,
} from 'lucide-react'
import { coachStore, useCoachStore } from '@/stores/coachStore.js'
import { cn } from '@utils/classNames.js'
import { formatDate } from '@utils/dateTime.js'

class CoachErrorBoundary extends Component {
	state = { hasError: false }

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error, info) {
		if (import.meta.env.DEV) console.error('AI Career Coach render error:', error, info)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
					<AlertTriangle className="mb-3 h-8 w-8 text-[var(--color-primary)]" />
					<h3 className="text-lg font-bold text-[var(--color-text)]">Chat temporarily unavailable</h3>
					<p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">The chat view hit a display problem. Your saved conversations are still available.</p>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false })}
						className="mt-5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
					>
						Retry chat
					</button>
				</div>
			)
		}
		return this.props.children
	}
}

/* ══════════════════════════════════════════════════════════════════
   PAGE HEADER — matches ATS / Resume Match eyebrow + title pattern
   ══════════════════════════════════════════════════════════════════ */

function CoachHeader({ onNewChat, isCreating, hasActive, onBack }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
		>
			<div className="flex min-w-0 items-start gap-3">
				{hasActive && (
					<button
						type="button"
						onClick={onBack}
						className="mt-1 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 text-[var(--color-muted)] transition-all hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] cursor-pointer sm:hidden"
						aria-label="Back to conversations"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
				)}
				<div className="min-w-0">
					<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
						AI CAREER COACH
					</p>
					<h2 className="text-2xl font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)] sm:text-[32px]">
						AI Career Coach
					</h2>
					<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">
						Get personalised career guidance, interview prep, and job-search strategy.
					</p>
				</div>
			</div>

			<div className="shrink-0">
				<motion.button
					type="button"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.97 }}
					onClick={onNewChat}
					disabled={isCreating}
					className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
				>
					{isCreating ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Plus className="h-4 w-4" />
					)}
					New Chat
				</motion.button>
			</div>
		</motion.div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   EMPTY / WELCOME STATE
   ══════════════════════════════════════════════════════════════════ */

function CoachWelcome({ onNewChat, isCreating }) {
	const STARTERS = [
		'How do I transition from software engineering to product management?',
		'What skills should I learn for a data science role in 2025?',
		'Help me prepare for a FAANG system design interview.',
		'How should I negotiate a job offer effectively?',
		'What projects should I build to land my first developer job?',
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			className="flex flex-col items-center justify-center py-12 text-center"
		>
			<motion.div
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
				className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20"
			>
				<Bot className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
			</motion.div>

			<h3 className="mb-2 text-xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
				Your AI Career Coach
			</h3>
			<p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
				Start a conversation to get personalised career advice, interview strategies, skill guidance, and more.
			</p>

			<motion.button
				type="button"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.97 }}
				onClick={onNewChat}
				disabled={isCreating}
				className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
			>
				{isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
				Start New Chat
			</motion.button>

			{/* Starter prompts */}
			<div className="w-full max-w-lg space-y-2">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
					Try asking
				</p>
				{STARTERS.map((prompt, i) => (
					<motion.button
						key={prompt}
						type="button"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 + i * 0.06 }}
						whileHover={{ scale: 1.01 }}
						onClick={() => onNewChat(prompt)}
						disabled={isCreating}
						className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left text-sm text-[var(--color-muted)] transition-all hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] disabled:opacity-50 cursor-pointer"
					>
						{prompt}
					</motion.button>
				))}
			</div>
		</motion.div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   CONVERSATION LIST SIDEBAR / PANEL
   ══════════════════════════════════════════════════════════════════ */

function ConversationList({ conversations = [], activeId, onSelect, isLoading }) {
	const [pendingDelete, setPendingDelete] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)

	async function executeDelete() {
		if (!pendingDelete) return
		setIsDeleting(true)
		try {
			const result = await coachStore.deleteConversation(pendingDelete.id)
			if (result.success) {
				toast.success('Conversation deleted')
			} else {
				toast.error(result.message || 'Failed to delete conversation')
			}
		} finally {
			setIsDeleting(false)
			setPendingDelete(null)
		}
	}

	if (isLoading) {
		return (
			<div className="space-y-2 p-1">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-14 rounded-xl animate-shimmer" />
				))}
			</div>
		)
	}

	if (conversations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-10 text-center">
				<MessageSquare className="mb-3 h-8 w-8 text-[var(--color-muted)]" strokeWidth={1.5} />
				<p className="text-sm text-[var(--color-muted)]">No conversations yet</p>
			</div>
		)
	}

	return (
		<>
			<div className="space-y-1">
				{conversations.map((convo, i) => (
					<motion.div
						key={convo.id}
						initial={{ opacity: 0, x: -8 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.25, delay: i * 0.04 }}
						className={cn(
							'group flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all cursor-pointer',
							activeId === convo.id
								? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/8'
								: 'border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)]',
						)}
					>
						<button
							type="button"
							className="min-w-0 flex-1 text-left"
							onClick={() => onSelect(convo.id)}
						>
							<p
								className={cn(
									'truncate text-[13px] font-medium transition-colors',
									activeId === convo.id
										? 'text-[var(--color-primary)]'
										: 'text-[var(--color-text)] group-hover:text-[var(--color-primary)]',
								)}
							>
								{convo.title || 'Untitled conversation'}
							</p>
							<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
								{formatDate(convo.updatedAt)}
							</p>
						</button>
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); setPendingDelete(convo) }}
							className="shrink-0 rounded-lg p-1 text-[var(--color-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
							title="Delete conversation"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</motion.div>
				))}
			</div>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{pendingDelete && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setPendingDelete(null)}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
									<AlertTriangle className="h-5 w-5" strokeWidth={2} />
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="text-base font-bold text-[var(--color-text)]">
										Delete Conversation?
									</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										Are you sure you want to delete{' '}
										<span className="font-semibold text-[var(--color-text)]">
											&ldquo;{pendingDelete.title || 'this conversation'}&rdquo;
										</span>
										? This cannot be undone.
									</p>
								</div>
							</div>
							<div className="mt-6 flex items-center justify-end gap-3">
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => setPendingDelete(null)}
									className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50 cursor-pointer"
								>
									Cancel
								</button>
								<button
									type="button"
									disabled={isDeleting}
									onClick={executeDelete}
									className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
								>
									{isDeleting ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	)
}

/* ══════════════════════════════════════════════════════════════════
   CHAT MESSAGE BUBBLE
   ══════════════════════════════════════════════════════════════════ */

/** Render markdown-like text: bold, lists, line breaks — safely, no HTML injection */
function MessageContent({ content }) {
	if (typeof content !== 'string' || content.length === 0) {
		return <p className="text-sm italic text-[var(--color-muted)]">No message content to display.</p>
	}
	const elements = []
	let listBuffer = []
	let listType = 'ul'
	let codeBuffer = null
	let key = 0
	const flushList = () => {
		if (!listBuffer.length) return
		const List = listType
		elements.push(<List key={key++} className={`my-1.5 space-y-0.5 pl-5 ${listType === 'ol' ? 'list-decimal' : 'list-disc'}`}>
			{listBuffer.map((item, index) => <li key={index} className="text-sm leading-relaxed"><InlineText text={item} /></li>)}
		</List>)
		listBuffer = []
	}
	const flushCode = () => {
		elements.push(<pre key={key++} className="my-2 overflow-x-auto rounded-lg bg-[var(--color-surface-3)] p-3 font-mono text-xs leading-relaxed"><code>{codeBuffer.join('\n')}</code></pre>)
		codeBuffer = null
	}

	content.split('\n').forEach((line) => {
		if (line.trimStart().startsWith('```')) {
			flushList()
			if (codeBuffer === null) codeBuffer = []
			else flushCode()
			return
		}
		if (codeBuffer !== null) {
			codeBuffer.push(line)
			return
		}
		const bullet = line.match(/^[-*•]\s+(.*)/)
		const numbered = line.match(/^\d+\.\s+(.*)/)
		if (bullet || numbered) {
			const nextType = numbered ? 'ol' : 'ul'
			if (listBuffer.length && listType !== nextType) flushList()
			listType = nextType
			listBuffer.push((bullet ?? numbered)[1])
			return
		}
		flushList()
		if (!line.trim()) {
			elements.push(<div key={key++} className="h-1.5" />)
			return
		}
		const heading = line.match(/^(#{1,6})\s+(.*)$/)
		if (heading) {
			const Heading = `h${Math.min(heading[1].length, 4)}`
			elements.push(<Heading key={key++} className="font-semibold leading-relaxed"><InlineText text={heading[2]} /></Heading>)
		} else {
			elements.push(<p key={key++} className="text-sm leading-relaxed"><InlineText text={line} /></p>)
		}
	})
	flushList()
	if (codeBuffer !== null) flushCode()
	return <div className="space-y-0.5">{elements}</div>
}

/** Render common inline Markdown safely without interpreting HTML. */
function InlineText({ text }) {
	const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g)
	return (
		<>
			{parts.map((part, i) => {
				if (part.startsWith('**') && part.endsWith('**')) {
					return <strong key={i}>{part.slice(2, -2)}</strong>
				}
				if (part.startsWith('__') && part.endsWith('__')) {
					return <strong key={i}>{part.slice(2, -2)}</strong>
				}
				if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
					return <em key={i}>{part.slice(1, -1)}</em>
				}
				if (part.startsWith('`') && part.endsWith('`')) {
					return (
						<code
							key={i}
							className="rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 font-mono text-xs"
						>
							{part.slice(1, -1)}
						</code>
					)
				}
				const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/)
				if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{link[1]}</a>
				return part
			})}
		</>
	)
}

function ChatBubble({ message, isNew }) {
	const isUser = message.role === 'user'

	return (
		<motion.div
			initial={isNew ? { opacity: 0, y: 10 } : false}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
		>
			{/* Avatar */}
			{!isUser && (
				<div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
					<Bot className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
				</div>
			)}

			<div
				className={cn(
					'max-w-[78%] rounded-2xl px-4 py-3 text-sm',
					isUser
						? 'rounded-tr-sm bg-[var(--color-primary)] text-white'
						: 'rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
				)}
			>
				{isUser ? (
					<p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
				) : (
					<MessageContent content={message.content} />
				)}
			</div>
		</motion.div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   TYPING INDICATOR
   ══════════════════════════════════════════════════════════════════ */

function TypingIndicator() {
	return (
		<div className="flex gap-3 justify-start">
			<div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
				<Bot className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
			</div>
			<div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
				{[0, 1, 2].map((i) => (
					<motion.div
						key={i}
						className="h-2 w-2 rounded-full bg-[var(--color-muted)]"
						animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
						transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
					/>
				))}
			</div>
		</div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   SEND ERROR BANNER
   ══════════════════════════════════════════════════════════════════ */

function SendErrorBanner({ message, onDismiss, onRetry }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 6 }}
			className="mx-4 mb-2 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5"
		>
			<AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
			<p className="flex-1 text-xs text-red-500">{message}</p>
			<button
				type="button"
				onClick={onRetry}
				className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
			>
				<RefreshCw className="h-3 w-3" /> Retry
			</button>
			<button type="button" onClick={onDismiss} className="rounded-lg px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]">Dismiss</button>
		</motion.div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   CHAT INPUT AREA
   ══════════════════════════════════════════════════════════════════ */

function ChatInput({ onSend, isSending, disabled }) {
	const draft = useCoachStore((s) => s.draft)
	const textareaRef = useRef(null)
	const MAX_CHARS = 4000

	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				if (!isSending && draft.trim()) onSend()
			}
		},
		[draft, isSending, onSend],
	)

	// Auto-resize textarea
	useEffect(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`
	}, [draft])

	const canSend = !isSending && !disabled && draft.trim().length > 0 && draft.length <= MAX_CHARS
	const overLimit = draft.length > MAX_CHARS

	return (
		<div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
			<div
				className={cn(
					'flex items-end gap-2 rounded-2xl border bg-[var(--color-surface-2)] px-4 py-2 transition-colors',
					overLimit
						? 'border-red-500/40'
						: 'border-[var(--color-border)] focus-within:border-[var(--color-primary)]/50 focus-within:ring-1 focus-within:ring-[var(--color-primary)]/20',
				)}
			>
				<textarea
					ref={textareaRef}
					id="coach-message-input"
					value={draft}
					onChange={(e) => coachStore.setDraft(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Ask your career coach anything…"
					rows={1}
					disabled={isSending || disabled}
					className="min-h-[24px] flex-1 resize-none bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none disabled:opacity-60"
					aria-label="Chat message input"
				/>
				<div className="flex shrink-0 flex-col items-end gap-1">
					{overLimit && (
						<span className="text-[10px] text-red-500">
							{draft.length}/{MAX_CHARS}
						</span>
					)}
					<motion.button
						type="button"
						whileHover={{ scale: canSend ? 1.08 : 1 }}
						whileTap={{ scale: canSend ? 0.93 : 1 }}
						onClick={onSend}
						disabled={!canSend}
						className={cn(
							'flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer',
							canSend
								? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90'
								: 'bg-[var(--color-surface-3)] text-[var(--color-muted)] cursor-not-allowed',
						)}
						aria-label="Send message"
					>
						{isSending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Send className="h-4 w-4" />
						)}
					</motion.button>
				</div>
			</div>
			<p className="mt-1.5 text-center text-[10px] text-[var(--color-muted)]">
				Press <kbd className="rounded px-1 py-0.5 border border-[var(--color-border)] bg-[var(--color-surface-3)] font-mono text-[9px]">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="rounded px-1 py-0.5 border border-[var(--color-border)] bg-[var(--color-surface-3)] font-mono text-[9px]">Shift+Enter</kbd> for new line
			</p>
		</div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   CHAT VIEW — messages + input
   ══════════════════════════════════════════════════════════════════ */

function ChatView({ conversationId }) {
	const storedMessages = useCoachStore((s) => s.messages)
	const messages = Array.isArray(storedMessages)
		? storedMessages.filter((message) => message && typeof message.id === 'string' && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
		: []
	const isLoadingMessages = useCoachStore((s) => s.isLoadingMessages)
	const isSending = useCoachStore((s) => s.isSending)
	const sendError = useCoachStore((s) => s.sendError)
	const error = useCoachStore((s) => s.error)

	const scrollRef = useRef(null)
	const prevMsgCount = useRef(0)
	const prevConversationId = useRef(null)

	// Scroll to bottom when messages change
	useEffect(() => {
		const conversationChanged = prevConversationId.current !== conversationId
		prevConversationId.current = conversationId
		if (conversationChanged || messages.length !== prevMsgCount.current) {
			prevMsgCount.current = messages.length
			const el = scrollRef.current
			if (el) {
				requestAnimationFrame(() => {
					el.scrollTop = el.scrollHeight
				})
			}
		}
	}, [conversationId, messages.length])

	const handleSend = useCallback(async () => {
		await coachStore.sendMessage()
	}, [])

	if (isLoadingMessages) {
		return (
			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="flex flex-1 items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
						<p className="text-sm text-[var(--color-muted)]">Loading conversation…</p>
					</div>
				</div>
				<ChatInput onSend={handleSend} isSending={isSending} disabled />
			</div>
		)
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{error && (
				<div role="alert" className="mx-4 mt-3 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5">
					<AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
					<p className="flex-1 text-xs text-red-500">{error}</p>
					<button type="button" onClick={() => coachStore.openConversation(conversationId)} className="text-xs font-semibold text-red-500">Retry</button>
				</div>
			)}
			{/* Messages */}
			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto px-4 py-5 space-y-4 sm:px-6"
			>
				{messages.length === 0 && !isSending && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex flex-col items-center justify-center py-16 text-center"
					>
						<Bot className="mb-3 h-10 w-10 text-[var(--color-muted)]" strokeWidth={1.5} />
						<p className="text-sm text-[var(--color-muted)]">
							Ask your first question to start the conversation.
						</p>
					</motion.div>
				)}

				{messages.map((msg, i) => (
					<ChatBubble
						key={msg.id}
						message={msg}
						isNew={i === messages.length - 1 && i > 0}
					/>
				))}

				{isSending && <TypingIndicator />}
			</div>

			{/* Send error */}
			<AnimatePresence>
				{sendError && (
					<SendErrorBanner
						message={sendError}
						onDismiss={() => coachStore.clearSendError()}
						onRetry={() => {
							coachStore.clearSendError()
							coachStore.sendMessage()
						}}
					/>
				)}
			</AnimatePresence>

			{/* Input */}
			<ChatInput onSend={handleSend} isSending={isSending} disabled={false} />
		</div>
	)
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════ */

function AiCoachContent() {
	const conversations = useCoachStore((s) => s.conversations)
	const isLoadingConversations = useCoachStore((s) => s.isLoadingConversations)
	const activeConversationId = useCoachStore((s) => s.activeConversationId)
	const error = useCoachStore((s) => s.error)
	const [isCreating, setIsCreating] = useState(false)
	const isCreatingRef = useRef(false)

	// Load conversation list on mount
	useEffect(() => {
		coachStore.loadConversations()
	}, [])

	async function handleNewChat(initialPrompt) {
		if (isCreatingRef.current) return
		isCreatingRef.current = true
		setIsCreating(true)
		try {
			const convo = await coachStore.createConversation()
			if (!convo) {
				toast.error('Failed to start a new conversation')
				return
			}
			// If a starter prompt was passed, send it immediately
			if (initialPrompt && typeof initialPrompt === 'string') {
				await coachStore.sendMessage(initialPrompt)
			}
		} catch (error) {
			console.error('Unable to start chat:', error)
			toast.error('Unable to start a chat. Please try again.')
		} finally {
			isCreatingRef.current = false
			setIsCreating(false)
		}
	}

	function handleSelectConversation(id) {
		coachStore.openConversation(id)
	}

	function handleBack() {
		coachStore.closeConversation()
	}

	const hasActive = Boolean(activeConversationId)

	return (
		<div className="space-y-5">
			{/* Page Header */}
			<CoachHeader
				onNewChat={handleNewChat}
				isCreating={isCreating}
				hasActive={hasActive}
				onBack={handleBack}
			/>

			{/* Full-page error */}
			<AnimatePresence>
				{error && !hasActive && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3"
					>
						<AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
						<p className="flex-1 text-sm text-red-500">{error}</p>
						<button
							type="button"
							onClick={() => coachStore.loadConversations()}
							className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
						>
							<RefreshCw className="h-3 w-3" /> Retry
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main Layout: Sidebar + Chat */}
			<div className="flex gap-5 overflow-hidden" style={{ minHeight: 'calc(100vh - 220px)' }}>

				{/* ── Sidebar: Conversation List ─────────────────────── */}
				<motion.aside
					initial={{ opacity: 0, x: -12 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.35 }}
					className={cn(
						'flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden',
						// On mobile, hide sidebar when a chat is active
						hasActive ? 'hidden sm:flex sm:w-72' : 'flex w-full sm:w-72',
					)}
				>
					<div className="border-b border-[var(--color-border)] px-4 py-3">
						<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
							Conversations
						</p>
					</div>
					<div className="flex-1 overflow-y-auto p-2">
						<ConversationList
							conversations={conversations}
							activeId={activeConversationId}
							onSelect={handleSelectConversation}
							isLoading={isLoadingConversations}
						/>
					</div>
				</motion.aside>

				{/* ── Main: Chat Area ────────────────────────────────── */}
				<motion.main
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.35, delay: 0.1 }}
					className={cn(
						'flex-1 flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden',
						// On mobile, show full width when active; hide when no active
						!hasActive ? 'hidden sm:flex' : 'flex',
					)}
				>
					{!hasActive ? (
						// Welcome / empty state
						<div className="flex-1 overflow-y-auto px-4 py-5">
							<CoachWelcome onNewChat={handleNewChat} isCreating={isCreating} />
						</div>
					) : (
						<ChatView conversationId={activeConversationId} />
					)}
				</motion.main>
			</div>
		</div>
	)
}

export function AiCoachPage() {
	return (
		<CoachErrorBoundary>
			<AiCoachContent />
		</CoachErrorBoundary>
	)
}
