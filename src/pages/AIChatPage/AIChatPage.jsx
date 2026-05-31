import { useEffect, useState } from 'react'
import AppShell from '../../layouts/AppShell'
import ChatBubble from '../../components/ChatBubble/ChatBubble'
import ChatInputBar from '../../components/ChatInputBar/ChatInputBar'
import GlassCard from '../../components/GlassCard/GlassCard'
import Badge from '../../components/Badge/Badge'
import { fetchChatMessages, insertChatMessage, getAuthUserId } from '../../lib/db'
import './AIChatPage.css'

const SUGGESTED = [
  'כמה הוצאתי על אוכל החודש?',
  'מה התקציב הפנוי שלי לחיסכון?',
  'הצג לי את ה-3 הוצאות הגדולות',
  'מה המגמה שלי ב-3 חודשים אחרונים?',
]

function mapDbMessage(msg) {
  return {
    id: msg.id,
    isAI: msg.is_ai,
    title: msg.title,
    text: msg.text,
    stats: msg.stats_payload,
    actionLabel: msg.action_label,
  }
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([])
  const [pipMode, setPipMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const userId = await getAuthUserId()
      if (!userId) return
      const { data } = await fetchChatMessages(userId)
      setMessages(data.map(mapDbMessage))
      setLoading(false)
    }
    load()
  }, [])

  async function handleSend(text) {
    const userId = await getAuthUserId()
    if (!userId) return

    const { data: userRow } = await insertChatMessage(userId, { is_ai: false, text })
    if (userRow) setMessages((prev) => [...prev, mapDbMessage(userRow)])

    const aiText = 'מנתח את הנתונים הפיננסיים שלך מ-Supabase... (חיבור AI מלא בקרוב)'
    const { data: aiRow } = await insertChatMessage(userId, {
      is_ai: true,
      text: aiText,
      title: 'Predicta AI',
    })
    if (aiRow) setMessages((prev) => [...prev, mapDbMessage(aiRow)])
  }

  return (
    <AppShell>
      <div className="page-header aichat-header">
        <div>
          <h1 className="text-headline-lg">Predicta AI</h1>
          <p className="text-body-md page-subtitle">היסטוריית צ&apos;אט נשמרת ב-chat_messages</p>
        </div>
        <button
          type="button"
          className={`aichat-pip-btn glass-panel${pipMode ? ' aichat-pip-btn--active' : ''}`}
          onClick={() => setPipMode((v) => !v)}
          title="מצב PIP"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {pipMode ? 'fullscreen' : 'picture_in_picture'}
          </span>
        </button>
      </div>

      <GlassCard className="aichat-status">
        <div className="aichat-status__dot" />
        <span className="text-label-bold">Predicta AI</span>
        <Badge color="primary">מחובר ל-DB</Badge>
      </GlassCard>

      <div className="aichat-suggested">
        <span className="text-label-light aichat-suggested__label">שאלות מוצעות:</span>
        <div className="aichat-chips hide-scrollbar">
          {SUGGESTED.map((q) => (
            <button key={q} type="button" className="aichat-chip glass-recessed" onClick={() => handleSend(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="aichat-messages">
        {loading ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>טוען הודעות...</p>
        ) : messages.length === 0 ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            אין הודעות עדיין — שלח שאלה כדי להתחיל
          </p>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              isAI={msg.isAI}
              title={msg.title}
              stats={msg.stats}
              actionLabel={msg.actionLabel}
            >
              {msg.text}
            </ChatBubble>
          ))
        )}
      </div>

      <ChatInputBar onSend={handleSend} placeholder="שאל על ההוצאות שלך..." />
    </AppShell>
  )
}
