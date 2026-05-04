import { useState } from 'react'
import AppShell    from '../../layouts/AppShell'
import ChatBubble  from '../../components/ChatBubble/ChatBubble'
import ChatInputBar from '../../components/ChatInputBar/ChatInputBar'
import GlassCard   from '../../components/GlassCard/GlassCard'
import Badge       from '../../components/Badge/Badge'
import './AIChatPage.css'

const SUGGESTED = [
  'כמה הוצאתי על אוכל החודש?',
  'מה התקציב הפנוי שלי לחיסכון?',
  'הצג לי את ה-3 הוצאות הגדולות',
  'מה המגמה שלי ב-3 חודשים אחרונים?',
]

const INITIAL_MESSAGES = [
  {
    id: 1,
    isAI: true,
    title: 'זיהיתי דפוס הוצאה חריג 🔍',
    text: 'שמתי לב שהוצאות המסעדות שלך עלו ב-42% לעומת החודש הקודם. רוב ההוצאה הייתה בסופי שבוע.',
    stats: [
      { label: 'החודש', value: '₪1,840', accent: true  },
      { label: 'חודש קודם', value: '₪1,300', accent: false },
    ],
    actionLabel: 'צפה בפירוט',
  },
]

export default function AIChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [pipMode, setPipMode]   = useState(false)

  function handleSend(text) {
    const userMsg = { id: Date.now(), isAI: false, text }
    const aiReply = {
      id: Date.now() + 1,
      isAI: true,
      text: 'מנתח את הנתונים הפיננסיים שלך...',
      typing: true,
    }
    setMessages(prev => [...prev, userMsg, aiReply])
  }

  return (
    <AppShell>
      {/* ── Header ── */}
      <div className="page-header aichat-header">
        <div>
          <h1 className="text-headline-lg">Predicta AI</h1>
          <p className="text-body-md page-subtitle">שאל כל שאלה על הכספים שלך</p>
        </div>
        {/* PIP toggle */}
        <button
          className={`aichat-pip-btn glass-panel${pipMode ? ' aichat-pip-btn--active' : ''}`}
          onClick={() => setPipMode(v => !v)}
          title="מצב PIP"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {pipMode ? 'fullscreen' : 'picture_in_picture'}
          </span>
        </button>
      </div>

      {/* ── AI Status bar ── */}
      <GlassCard className="aichat-status">
        <div className="aichat-status__dot" />
        <span className="text-label-bold">Predicta AI</span>
        <Badge color="primary">מחובר</Badge>
        <span className="text-label-light aichat-status__model">Gemini 1.5 Pro</span>
      </GlassCard>

      {/* ── Suggested questions ── */}
      <div className="aichat-suggested">
        <span className="text-label-light aichat-suggested__label">שאלות מוצעות:</span>
        <div className="aichat-chips hide-scrollbar">
          {SUGGESTED.map(q => (
            <button
              key={q}
              className="aichat-chip glass-recessed"
              onClick={() => handleSend(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="aichat-messages">
        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            isAI={msg.isAI}
            title={msg.title}
            stats={msg.stats}
            actionLabel={msg.actionLabel}
          >
            {msg.typing ? (
              <div className="aichat-typing">
                <span /><span /><span />
              </div>
            ) : msg.text}
          </ChatBubble>
        ))}
      </div>

      {/* Chat input — positioned above bottom nav */}
      <ChatInputBar onSend={handleSend} placeholder="שאל על ההוצאות שלך..." />
    </AppShell>
  )
}
