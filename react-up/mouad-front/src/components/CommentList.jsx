import "./CommentList.css"

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-content">{comment.contenu}</div>
          {comment.user && (
            <div className="comment-author">
              <span className="author-name">
                {comment.user.firstName} {comment.user.lastName}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CommentList
