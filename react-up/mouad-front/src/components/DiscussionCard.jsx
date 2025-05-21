import { Link } from "react-router-dom"
import "./DiscussionCard.css"

const DiscussionCard = ({ discussion }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Calculate comment count
  const commentCount = discussion.commentaires ? discussion.commentaires.length : 0

  return (
    <div className="discussion-card">
      <div className="discussion-card-content">
        <Link to={`/discussions/${discussion.id}`} className="discussion-title-link">
          <h3 className="discussion-title">{discussion.sujet}</h3>
        </Link>

        <div className="discussion-meta">
          <span className="discussion-date">{formatDate(discussion.date)}</span>
          {discussion.user && (
            <span className="discussion-author">
              By: {discussion.user.firstName} {discussion.user.lastName}
            </span>
          )}
        </div>

        <div className="discussion-stats">
          <span className="comment-count">
            <i className="comment-icon">💬</i> {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      <Link to={`/discussions/${discussion.id}`} className="view-discussion-button">
        Join Discussion
      </Link>
    </div>
  )
}

export default DiscussionCard
