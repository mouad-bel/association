"use client"

import { useState } from "react"
import { useEvents } from "../contexts/EventContext.jsx"
import "./EventForm.css"

const EventForm = ({ onSuccess }) => {
  const { createEvent } = useEvents()
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    image: null,
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createEvent(formData)
      setFormData({
        titre: "",
        description: "",
        date: new Date().toISOString().slice(0, 16),
        image: null,
      })
      setPreview(null)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titre">Title</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (Optional)</label>
          <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" disabled={loading} />
          {preview && (
            <div className="image-preview">
              <img src={preview || "/placeholder.svg"} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  )
}

export default EventForm
