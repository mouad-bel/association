"use client"

import { useState } from "react"
import { useEvents } from "../contexts/EventContext.jsx"
import { useDiscussions } from "../contexts/DiscussionContext.jsx"
import "./CommentForm.css"

const CommentForm = ({ resourceId, resourceType, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const eventContext = useEvents()
  const discussionContext = useDiscussions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError(null)

    try {
      let newComment

      if (resourceType === "discussion") {
        newComment = await discussionContext.addComment(resourceId, content)
      } else {
        // Default to event comments
        newComment = await eventContext.addComment(resourceId, content)
      }

      onCommentAdded(newComment)
      setContent("")
    } catch (err) {
      setError(err.message || "Failed to add comment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comment-form-container">
      <h3>Add a Comment</h3>
      {error && <div className="error-message">{error}</div>}

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  )
}

export default CommentForm
