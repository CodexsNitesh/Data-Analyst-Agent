import { useState, useCallback } from 'react'
import { askQuestion } from '../services/api'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (sessionId, question) => {
    setLoading(true)
    setError(null)
    const userMsg = { id: Date.now(), role: 'user', content: question }
    setMessages((prev) => [...prev, userMsg])
    try {
      const res = await askQuestion({ session_id: sessionId, question })
      const { answer, sql_query, query_result, execution_time_ms } = res.data
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: answer, sql_query, query_result, execution_time_ms },
      ])
    } catch (err) {
      setError('Request failed')
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Something went wrong. Please try again.', isError: true },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHistory = useCallback((sessionMessages) => {
    setMessages(sessionMessages.map((m, i) => ({ ...m, id: i })))
  }, [])

  const reset = useCallback(() => setMessages([]), [])

  return { messages, loading, error, send, loadHistory, reset }
}