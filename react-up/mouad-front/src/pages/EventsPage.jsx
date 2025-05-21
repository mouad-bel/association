"use client"

import { useState, useEffect } from "react"
import { useEvents } from "../contexts/EventContext.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import EventCard from "../components/EventCard.jsx"
import EventForm from "../components/EventForm.jsx"
import "./EventsPage.css"

const EventsPage = () => {
  const { events, loading, error, fetchEvents } = useEvents()
  const { currentUser } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleFormSuccess = () => {
    setShowForm(false)
    fetchEvents()
  }

  const filteredEvents = events.filter(
    (event) =>
      event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && events.length === 0) {
    return (
      <div className="events-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className="events-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchEvents} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Community Events</h1>
        <div className="events-actions">
          {currentUser && (
            <button className="create-event-button" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Create Event"}
            </button>
          )}
        </div>
      </div>

      {showForm && <EventForm onSuccess={handleFormSuccess} />}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <div className="no-events-icon">📅</div>
          <h2>No events found</h2>
          <p>
            {searchTerm ? "No events match your search. Try different keywords." : "Be the first to create an event!"}
          </p>
          {!searchTerm && currentUser && !showForm && (
            <button className="create-event-button-empty" onClick={() => setShowForm(true)}>
              Create Event
            </button>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsPage
