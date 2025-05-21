"use client"

import { useState, useEffect } from "react"
import { useDiscussions } from "../contexts/DiscussionContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import DiscussionCard from "../components/DiscussionCard.jsx"
import DiscussionForm from "../components/DiscussionForm.jsx"
import "./DiscussionsPage.css"

const DiscussionsPage = () => {
  const { discussions, loading, error, fetchDiscussions } = useDiscussions()
  const { currentUser } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDiscussions()
  }, [fetchDiscussions])

  const handleFormSuccess = () => {
    setShowForm(false)
    fetchDiscussions()
  }

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.sujet.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && discussions.length === 0) {
    return (
      <div className="discussions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading discussions...</p>
        </div>
      </div>
    )
  }

  if (error && discussions.length === 0) {
    return (
      <div className="discussions-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchDiscussions} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="discussions-page">
      <div className="discussions-header">
        <h1>Community Discussions</h1>
        <div className="discussions-actions">
          {currentUser && (
            <button className="create-discussion-button" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Start a Discussion"}
            </button>
          )}
        </div>
      </div>

      {showForm && <DiscussionForm onSuccess={handleFormSuccess} />}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredDiscussions.length === 0 ? (
        <div className="no-discussions">
          <div className="no-discussions-icon">💬</div>
          <h2>No discussions found</h2>
          <p>
            {searchTerm
              ? "No discussions match your search. Try different keywords."
              : "Be the first to start a discussion!"}
          </p>
          {!searchTerm && currentUser && !showForm && (
            <button className="start-discussion-button" onClick={() => setShowForm(true)}>
              Start a Discussion
            </button>
          )}
        </div>
      ) : (
        <div className="discussions-list">
          {filteredDiscussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscussionsPage
