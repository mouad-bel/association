"use client"

import { useState } from "react"
import { useDiscussions } from "../contexts/DiscussionContext.jsx"
import "./DiscussionForm.css"

const DiscussionForm = ({ onSuccess }) => {
  const { createDiscussion } = useDiscussions()
  const [sujet, setSujet] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sujet.trim()) return

    setLoading(true)
    setError(null)

    try {
      await createDiscussion({ sujet })
      setSujet("")
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || "Failed to create discussion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="discussion-form-container">
      <h2>Start a New Discussion</h2>
      {error && <div className="error-message">{error}</div>}

      <form className="discussion-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sujet">Topic</label>
          <input
            type="text"
            id="sujet"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder="What would you like to discuss?"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading || !sujet.trim()}>
          {loading ? "Creating..." : "Start Discussion"}
        </button>
      </form>
    </div>
  )
}

export default DiscussionForm
