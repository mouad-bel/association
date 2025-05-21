import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { EventProvider } from "./contexts/EventContext.jsx"
import { DiscussionProvider } from "./contexts/DiscussionContext.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import Navbar from "./components/Navbar.jsx"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import EventsPage from "./pages/EventsPage.jsx"
import EventDetailPage from "./pages/EventDetailPage.jsx"
import DiscussionsPage from "./pages/DiscussionsPage.jsx"
import DiscussionDetailPage from "./pages/DiscussionDetailPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <DiscussionProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/discussions" element={<DiscussionsPage />} />
                <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>© {new Date().getFullYear()} Association App</p>
            </footer>
          </div>
        </DiscussionProvider>
      </EventProvider>
    </AuthProvider>
  )
}

export default App
