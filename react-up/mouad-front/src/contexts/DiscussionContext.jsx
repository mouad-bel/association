"use client"

import { createContext, useState, useContext, useCallback } from "react"
import { useAuth } from "./AuthContext"

const DiscussionContext = createContext(null)

export const useDiscussions = () => useContext(DiscussionContext)

export const DiscussionProvider = ({ children }) => {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  const fetchDiscussions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8082/api/discussions")
      if (!response.ok) {
        throw new Error("Failed to fetch discussions")
      }
      const data = await response.json()
      setDiscussions(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error("Error fetching discussions:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDiscussionById = useCallback(async (discussionId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8082/api/discussions/${discussionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch discussion")
      }
      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      console.error(`Error fetching discussion ${discussionId}:`, err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createDiscussion = useCallback(
      async (discussionData) => {
        if (!currentUser) {
          throw new Error("You must be logged in to create a discussion")
        }

        setLoading(true)
        setError(null)
        try {
          // Add the current user to the discussion data
          const discussionWithUser = {
            ...discussionData,
            user: {
              id: currentUser.id,
            },
          }

          const response = await fetch("http://localhost:8082/api/discussions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(discussionWithUser),
          })

          if (!response.ok) {
            throw new Error("Failed to create discussion")
          }

          const newDiscussion = await response.json()
          setDiscussions((prevDiscussions) => [...prevDiscussions, newDiscussion])
          return newDiscussion
        } catch (err) {
          setError(err.message)
          console.error("Error creating discussion:", err)
          throw err
        } finally {
          setLoading(false)
        }
      },
      [currentUser],
  )

  const deleteDiscussion = useCallback(
      async (discussionId) => {
        if (!currentUser) {
          throw new Error("You must be logged in to delete a discussion")
        }

        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`http://localhost:8082/api/discussions/${discussionId}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Failed to delete discussion")
          }

          setDiscussions((prevDiscussions) => prevDiscussions.filter((discussion) => discussion.id !== discussionId))
          return true
        } catch (err) {
          setError(err.message)
          console.error("Error deleting discussion:", err)
          throw err
        } finally {
          setLoading(false)
        }
      },
      [currentUser],
  )

  const fetchComments = useCallback(async (discussionId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/discussions/${discussionId}/commentaires`)
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }
      return await response.json()
    } catch (err) {
      console.error("Error fetching comments:", err)
      throw err
    }
  }, [])

  const addComment = useCallback(
      async (discussionId, commentContent) => {
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
            },
          }

          const response = await fetch(`http://localhost:8082/api/discussions/${discussionId}/commentaires`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          })

          if (!response.ok) {
            throw new Error("Failed to add comment")
          }

          return await response.json()
        } catch (err) {
          console.error("Error adding comment:", err)
          throw err
        }
      },
      [currentUser],
  )

  const value = {
    discussions,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussionById,
    createDiscussion,
    deleteDiscussion,
    fetchComments,
    addComment,
  }

  return <DiscussionContext.Provider value={value}>{children}</DiscussionContext.Provider>
}
