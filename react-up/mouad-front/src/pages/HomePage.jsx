"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import "./HomePage.css"

const HomePage = () => {
  const { currentUser } = useAuth()

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Association</h1>
          <p>Connect with others, share events, and build community through discussions</p>
          <div className="hero-buttons">
            {currentUser ? (
              <>
                <Link to="/events" className="btn btn-primary">
                  Explore Events
                </Link>
                <Link to="/discussions" className="btn btn-secondary">
                  Join Discussions
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-shape"></div>
        </div>
      </div>

      <div className="features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Events</h3>
            <p>Discover and participate in community events that interest you</p>
            <Link to="/events" className="feature-link">
              View Events
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Discussions</h3>
            <p>Engage in meaningful conversations with community members</p>
            <Link to="/discussions" className="feature-link">
              Join Discussions
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Connect with like-minded individuals and build relationships</p>
            <Link to="/register" className="feature-link">
              Join Community
            </Link>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our community today and start connecting with others</p>
        {currentUser ? (
          <Link to="/profile" className="cta-button">
            View Your Profile
          </Link>
        ) : (
          <Link to="/register" className="cta-button">
            Create an Account
          </Link>
        )}
      </div>
    </div>
  )
}

export default HomePage
