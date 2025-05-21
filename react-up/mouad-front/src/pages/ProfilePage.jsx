"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useEvents } from "../contexts/EventContext.jsx"
import { useDiscussions } from "../contexts/DiscussionContext.jsx"
import EventCard from "../components/EventCard.jsx"
import DiscussionCard from "../components/DiscussionCard.jsx"
import "./ProfilePage.css"

const ProfilePage = () => {
  const { currentUser } = useAuth()
  const { fetchEvents, events, createMockEvent } = useEvents()
  const { fetchDiscussions, discussions } = useDiscussions()
  const [userEvents, setUserEvents] = useState([])
  const [userDiscussions, setUserDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("events")

  useEffect(() => {
    const loadUserContent = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchEvents(), fetchDiscussions()])
      } catch (error) {
        console.error("Error fetching user content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserContent()
  }, [fetchEvents, fetchDiscussions])

  // This effect handles filtering events for the current user
  useEffect(() => {
    if (currentUser) {
      console.log("Current user ID:", currentUser.id)
      console.log("All events:", events)

      // Filter events that belong to the current user
      const filteredEvents = events.filter((event) => {
        // Convert IDs to strings for comparison
        const currentUserId = String(currentUser.id)
        const eventUserId = event.user && event.user.id ? String(event.user.id) : null
        const directUserId = event.userId ? String(event.userId) : null

        // Also check by name if ID matching fails
        const matchesByName =
            (event.userFirstName === currentUser.firstName && event.userLastName === currentUser.lastName) ||
            (event.user && event.user.firstName === currentUser.firstName && event.user.lastName === currentUser.lastName)

        return eventUserId === currentUserId || directUserId === currentUserId || matchesByName
      })

      console.log("Filtered events for profile:", filteredEvents)
      setUserEvents(filteredEvents)
    }
  }, [events, currentUser])

  useEffect(() => {
    if (discussions.length > 0 && currentUser) {
      const filteredDiscussions = discussions.filter(
          (discussion) => discussion.user && String(discussion.user.id) === String(currentUser.id),
      )
      setUserDiscussions(filteredDiscussions)
    }
  }, [discussions, currentUser])

  // Add a test event for debugging
  const addTestEvent = () => {
    const newEvent = createMockEvent()
    setUserEvents((prev) => [...prev, newEvent])
  }

  if (loading) {
    return (
        <div className="profile-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser.firstName.charAt(0)}
            {currentUser.lastName.charAt(0)}
          </div>
          <h1>
            {currentUser.firstName} {currentUser.lastName}
          </h1>
        </div>

        <div className="profile-info">
          <div className="profile-details">
            <h2>Personal Information</h2>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{currentUser.email}</span>
            </div>
            {currentUser.phone && (
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{currentUser.phone}</span>
                </div>
            )}

            {/* Debug button - remove in production */}
            <button onClick={addTestEvent} className="debug-button" style={{ marginTop: "10px" }}>
              Add Test Event (Debug)
            </button>
          </div>
        </div>

        {/* Debug information */}
        <div
            className="profile-debug"
            style={{ margin: "20px 0", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}
        >
          <h3 style={{ marginBottom: "10px" }}>Debug Information</h3>
          <p>
            Current User ID: {currentUser.id} (Type: {typeof currentUser.id})
          </p>
          <p>Total Events: {events.length}</p>
          <p>User Events: {userEvents.length}</p>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>All Events Data</summary>
            <pre
                style={{ marginTop: "10px", padding: "10px", backgroundColor: "#eee", overflowX: "auto", fontSize: "12px" }}
            >
            {JSON.stringify(events, null, 2)}
          </pre>
          </details>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>User Events Data</summary>
            <pre
                style={{ marginTop: "10px", padding: "10px", backgroundColor: "#eee", overflowX: "auto", fontSize: "12px" }}
            >
            {JSON.stringify(userEvents, null, 2)}
          </pre>
          </details>
          <button
              onClick={() => fetchEvents()}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
          >
            Refresh Events
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button
                className={`tab-button ${activeTab === "events" ? "active" : ""}`}
                onClick={() => setActiveTab("events")}
            >
              My Events ({userEvents.length})
            </button>
            <button
                className={`tab-button ${activeTab === "discussions" ? "active" : ""}`}
                onClick={() => setActiveTab("discussions")}
            >
              My Discussions ({userDiscussions.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "events" && (
                <div className="user-events">
                  {userEvents.length === 0 ? (
                      <div className="no-content">
                        <p>You haven't created any events yet.</p>
                        <Link to="/events" className="create-link">
                          Create an Event
                        </Link>
                      </div>
                  ) : (
                      <div className="events-grid">
                        {userEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                  )}
                </div>
            )}

            {activeTab === "discussions" && (
                <div className="user-discussions">
                  {userDiscussions.length === 0 ? (
                      <div className="no-content">
                        <p>You haven't started any discussions yet.</p>
                        <Link to="/discussions" className="create-link">
                          Start a Discussion
                        </Link>
                      </div>
                  ) : (
                      <div className="discussions-list">
                        {userDiscussions.map((discussion) => (
                            <DiscussionCard key={discussion.id} discussion={discussion} />
                        ))}
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default ProfilePage
