"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("connectedUser")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("connectedUser")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8082/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      // Store the entire user object
      localStorage.setItem("connectedUser", JSON.stringify(data.userDetails))
      setCurrentUser(data.userDetails)
      return data.userDetails
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:8082/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      return await response.text()
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("connectedUser")
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
