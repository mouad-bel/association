"use client"

import { createContext, useState, useContext, useCallback, useEffect } from "react"
import { useAuth } from "./AuthContext"

const EventContext = createContext(null)

export const useEvents = () => useContext(EventContext)

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  // Local storage key for caching events
  const LOCAL_STORAGE_KEY = "association_events_cache"

  // Helper function to fix malformed JSON
  const safelyParseJSON = async (response) => {
    const text = await response.text()

    try {
      // Try to parse the JSON normally first
      return JSON.parse(text)
    } catch (e) {
      console.log("Received malformed JSON, attempting to fix...")

      // Try to fix the common "user":} issue
      const fixedText = text.replace(/"user":\}/g, '"user":{}')

      // Try to parse the fixed JSON
      try {
        return JSON.parse(fixedText)
      } catch (e2) {
        console.error("Could not fix JSON:", e2)
        console.error("Original text:", text)
        throw new Error("Invalid JSON response from server")
      }
    }
  }

  // Load events from local storage on initial mount
  useEffect(() => {
    const cachedEvents = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (cachedEvents) {
      try {
        setEvents(JSON.parse(cachedEvents))
      } catch (e) {
        console.error("Error parsing cached events:", e)
      }
    }
  }, [])

  // Save events to local storage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events))
    }
  }, [events])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8082/api/evenements/events")

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      console.log("Events data from API:", data)
      setEvents(data)
      return data
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err.message || "Failed to fetch events")
      // Don't return events here, as it could cause an infinite loop
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserEvents = useCallback(async () => {
    if (!currentUser) return []

    try {
      const response = await fetch(`http://localhost:8082/api/evenements/user/${currentUser.id}`)

      if (response.ok) {
        const data = await response.json()
        console.log("User events from API:", data)
        return data
      } else {
        console.warn(`API returned status ${response.status} for user events`)
        // Fall back to filtering from all events
        return []
      }
    } catch (err) {
      console.error("Error fetching user events:", err)
      // Fall back to filtering from all events
      return []
    }
  }, [currentUser])

  const fetchEventById = useCallback(
      async (eventId) => {
        setLoading(true)
        setError(null)
        try {
          // First check if we have this event in our local state
          const localEvent = events.find((e) => String(e.id) === String(eventId))
          if (localEvent) {
            console.log("Found event in local cache:", localEvent)
            return localEvent
          }

          // If not in local state, try to fetch from API
          const response = await fetch(`http://localhost:8082/api/evenements/${eventId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch event")
          }

          // Now we can use regular JSON parsing
          const data = await response.json()
          return data
        } catch (err) {
          setError(err.message)
          console.error(`Error fetching event ${eventId}:`, err)
          throw err
        } finally {
          setLoading(false)
        }
      },
      [events],
  )

  const createEvent = useCallback(
      async (eventData) => {
        if (!currentUser) {
          throw new Error("You must be logged in to create an event")
        }

        setLoading(true)
        setError(null)
        try {
          // Create a new FormData object
          const formData = new FormData()

          // Add event details
          formData.append("titre", eventData.titre)
          formData.append("description", eventData.description)
          formData.append("date", eventData.date)

          // Add user information
          formData.append("user.id", currentUser.id)
          formData.append("user.firstName", currentUser.firstName)
          formData.append("user.lastName", currentUser.lastName)
          formData.append("user.email", currentUser.email)

          // Add image if provided
          if (eventData.image) {
            formData.append("image", eventData.image)
          }

          console.log("Sending event with user ID:", currentUser.id)

          const response = await fetch("http://localhost:8082/api/evenements/newEvent", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Failed to create event")
          }

          // Use our safelyParseJSON helper to handle malformed JSON
          const newEvent = await safelyParseJSON(response)

          // Ensure the user is properly attached to the event in the frontend state
          if (!newEvent.user) {
            newEvent.user = {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
            }
          }

          // Add to local state
          setEvents((prevEvents) => [...prevEvents, newEvent])
          return newEvent
        } catch (err) {
          setError(err.message)
          console.error("Error creating event:", err)
          throw err
        } finally {
          setLoading(false)
        }
      },
      [currentUser],
  )

  const deleteEvent = useCallback(
      async (eventId) => {
        if (!currentUser) {
          throw new Error("You must be logged in to delete an event")
        }

        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`http://localhost:8082/api/evenements/delete/${eventId}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Failed to delete event")
          }

          // Remove from local state
          setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
          return true
        } catch (err) {
          setError(err.message)
          console.error("Error deleting event:", err)
          throw err
        } finally {
          setLoading(false)
        }
      },
      [currentUser],
  )

  const fetchComments = useCallback(async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/evenements/${eventId}/commentaires`)
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      // Use our safe parsing function
      return await safelyParseJSON(response)
    } catch (err) {
      console.error("Error fetching comments:", err)
      throw err
    }
  }, [])

  const addComment = useCallback(
      async (eventId, commentContent) => {
        if (!currentUser) {
          throw new Error("You must be logged in to comment")
        }

        try {
          const commentData = {
            contenu: commentContent,
            user: {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
            },
          }

          const response = await fetch(`http://localhost:8082/api/evenements/${eventId}/commentaires`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          })

          if (!response.ok) {
            throw new Error("Failed to add comment")
          }

          // Use our safe parsing function
          return await safelyParseJSON(response)
        } catch (err) {
          console.error("Error adding comment:", err)
          throw err
        }
      },
      [currentUser],
  )

  // Get events created by the current user
  const getUserEvents = useCallback(() => {
    if (!currentUser || !events.length) return []

    // Filter events that belong to the current user
    const filteredEvents = events.filter((event) => {
      if (!event) return false

      // Convert IDs to strings for comparison
      const currentUserId = String(currentUser.id)
      const eventUserId = event.user && event.user.id ? String(event.user.id) : null

      return eventUserId === currentUserId
    })

    console.log("Filtered events for current user:", filteredEvents)
    return filteredEvents
  }, [events, currentUser])

  // Create a mock event for testing
  const createMockEvent = useCallback(() => {
    if (!currentUser) {
      throw new Error("You must be logged in to create a mock event")
    }

    const mockEvent = {
      id: Date.now(),
      titre: "Test Event " + new Date().toLocaleTimeString(),
      description: "This is a test event created for debugging",
      date: new Date().toISOString(),
      user: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      },
    }

    setEvents((prevEvents) => [...prevEvents, mockEvent])
    return mockEvent
  }, [currentUser])

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    fetchComments,
    addComment,
    getUserEvents,
    createMockEvent,
    fetchUserEvents,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}
