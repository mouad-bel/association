import { Link } from "react-router-dom"
import "./EventCard.css"

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Handle different user data formats
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

  return (
      <div className="event-card">
        {event.pieceJoint && (
            <div className="event-image">
              <img
                  src={`http://localhost:8082/uploads/${event.pieceJoint}`}
                  alt={event.titre}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image"
                  }}
              />
            </div>
        )}
        <div className="event-content">
          <h3 className="event-title">{event.titre}</h3>
          <p className="event-date">{formatDate(event.date)}</p>
          <p className="event-description">
            {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
          </p>
          <p className="event-author">By: {getAuthorName()}</p>
          <Link to={`/events/${event.id}`} className="view-button">
            View Details
          </Link>
        </div>
      </div>
  )
}

export default EventCard
