import { useState } from 'react'
import './ChatInputBar.css'

/*
 * Floating chat input bar — fixed above BottomNav.
 * Mirrors the bottom input area in ai_liquid_glass/code.html.
 *
 * Fixed bar
 * └── inner wrap (glass-recessed, pill)
 *     ├── attach button (add_circle icon)
 *     ├── text input
 *     └── send button (orange pill)
 */
export default function ChatInputBar({ onSend, placeholder = 'Ask about your finances...' }) {
  const [value, setValue] = useState('')

  function handleSend() {
    if (!value.trim()) return
    onSend?.(value.trim())
    setValue('')
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="chat-input-bar">
      <div className="chat-input-bar__inner glass-recessed">

        {/* Attach / add */}
        <button className="chat-input-bar__attach" aria-label="Attach">
          <span className="material-symbols-outlined">add_circle</span>
        </button>

        {/* Text input */}
        <input
          className="chat-input-bar__input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
        />

        {/* Send button */}
        <button className="chat-input-bar__send" onClick={handleSend} aria-label="Send">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>

      </div>
    </div>
  )
}
