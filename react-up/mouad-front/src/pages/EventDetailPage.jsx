"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEvents } from "../contexts/EventContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import CommentList from "../components/CommentList.jsx"
import CommentForm from "../components/CommentForm.jsx"
import "./EventDetailPage.css"

const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { fetchEventById, fetchComments, deleteEvent } = useEvents()
  const [event, setEvent] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true)
        const eventData = await fetchEventById(id)
        setEvent(eventData)

        const commentsData = await fetchComments(id)
        setComments(commentsData)

        setError(null)
      } catch (err) {
        setError(err.message || "Failed to load event details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [id, fetchEventById, fetchComments])

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id)
        navigate("/events")
      } catch (err) {
        setError(err.message || "Failed to delete event")
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
        <div className="event-detail-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading event details...</p>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="event-detail-page">
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button onClick={() => navigate("/events")} className="back-button">
              Back to Events
            </button>
          </div>
        </div>
    )
  }

  if (!event) {
    return (
        <div className="event-detail-page">
          <div className="not-found-container">
            <h2>Event not found</h2>
            <button onClick={() => navigate("/events")} className="back-button">
              Back to Events
            </button>
          </div>
        </div>
    )
  }

  const getAuthorName = () => {
    if (event.user && event.user.firstName && event.user.lastName) {
      return `${event.user.firstName} ${event.user.lastName}`
    } else if (event.userFirstName && event.userLastName) {
      return `${event.userFirstName} ${event.userLastName}`
    } else if (event.userName) {
      return event.userName
    } else {
      return "Unknown Author"
    }
  }

  const isOwner = currentUser && ((event.user && event.user.id === currentUser.id) || event.userId === currentUser.id)

  return (
      <div className="event-detail-page">
        <div className="event-container">
          <div className="event-header">
            <h1>{event.titre}</h1>
            <div className="event-meta">
              <span className="event-date">{formatDate(event.date)}</span>
              <span className="event-author">By: {getAuthorName()}</span>
            </div>
          </div>

          {event.pieceJoint && (
              <div className="event-image">
                <img
                    src={`http://localhost:8082/uploads/${event.pieceJoint}`}
                    alt={event.titre}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder-image.jpg"
                    }}
                />
              </div>
          )}

          <div className="event-description">
            <p>{event.description}</p>
          </div>

          {isOwner && (
              <div className="event-actions">
                <button onClick={handleDeleteEvent} className="delete-button">
                  Delete Event
                </button>
              </div>
          )}

          <div className="event-comments-section">
            <h2>Comments</h2>
            <CommentList comments={comments} />

            {currentUser ? (
                <CommentForm resourceId={id} resourceType="event" onCommentAdded={handleCommentAdded} />
            ) : (
                <div className="login-prompt">
                  <p>
                    Please <a href="/login">login</a> to add a comment.
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default EventDetailPage
