"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDiscussions } from "../contexts/DiscussionContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import CommentList from "../components/CommentList.jsx"
import CommentForm from "../components/CommentForm.jsx"
import "./DiscussionDetailPage.css"

const DiscussionDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { fetchDiscussionById, fetchComments, deleteDiscussion } = useDiscussions()

  const [discussion, setDiscussion] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDiscussionData = async () => {
      try {
        setLoading(true)
        const discussionData = await fetchDiscussionById(id)
        setDiscussion(discussionData)

        const commentsData = await fetchComments(id)
        setComments(commentsData)

        setError(null)
      } catch (err) {
        setError(err.message || "Failed to load discussion details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadDiscussionData()
  }, [id, fetchDiscussionById, fetchComments])

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  const handleDeleteDiscussion = async () => {
    if (window.confirm("Are you sure you want to delete this discussion?")) {
      try {
        await deleteDiscussion(id)
        navigate("/discussions")
      } catch (err) {
        setError(err.message || "Failed to delete discussion")
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="discussion-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading discussion...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="discussion-detail-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={() => navigate("/discussions")} className="back-button">
            Back to Discussions
          </button>
        </div>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="discussion-detail-page">
        <div className="not-found-container">
          <h2>Discussion not found</h2>
          <button onClick={() => navigate("/discussions")} className="back-button">
            Back to Discussions
          </button>
        </div>
      </div>
    )
  }

  const isOwner = currentUser && discussion.user && currentUser.id === discussion.user.id

  return (
    <div className="discussion-detail-page">
      <div className="discussion-container">
        <div className="discussion-header">
          <h1>{discussion.sujet}</h1>
          <div className="discussion-meta">
            <span className="discussion-date">{formatDate(discussion.date)}</span>
            {discussion.user && (
              <span className="discussion-author">
                By: {discussion.user.firstName} {discussion.user.lastName}
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="discussion-actions">
            <button onClick={handleDeleteDiscussion} className="delete-button">
              Delete Discussion
            </button>
          </div>
        )}

        <div className="discussion-comments-section">
          <h2>Comments</h2>
          <CommentList comments={comments} />

          {currentUser ? (
            <CommentForm resourceId={id} resourceType="discussion" onCommentAdded={handleCommentAdded} />
          ) : (
            <div className="login-prompt">
              <p>
                Please <a href="/login">login</a> to join the discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscussionDetailPage
