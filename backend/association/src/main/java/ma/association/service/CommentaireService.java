package ma.association.service;

import ma.association.model.Commentaires;
import ma.association.model.Discussion;
import ma.association.model.Post;
import ma.association.repository.CommentaireRepository;
import ma.association.repository.DiscussionRepository;
import ma.association.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentaireService {

    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private DiscussionRepository discussionRepository;


    public List<Commentaires> getCommentairesForPost(Long postId) {
        return commentaireRepository.findByPostId(postId);
    }


    public Commentaires addCommentaireToPost(Long postId, Commentaires commentaire) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return null;

        commentaire.setPost(post);
        commentaire.setDiscussion(null);
        return commentaireRepository.save(commentaire);
    }
    public List<Commentaires> getCommentairesForDiscussion(Long discussionId) {
        return commentaireRepository.findByDiscussionId(discussionId);
    }

    public Commentaires addCommentaireToDiscussion(Long discussionId, Commentaires commentaire) {
        Discussion discussion = discussionRepository.findById(discussionId).orElse(null);
        if (discussion == null) return null;

        commentaire.setDiscussion(discussion);
        commentaire.setPost(null); // ensure not attached to event
        return commentaireRepository.save(commentaire);
    }
    public boolean deleteCommentaireFromDiscussion(Long discussionId, Long commentaireId) {
        Commentaires commentaire = commentaireRepository.findById(commentaireId).orElse(null);
        if (commentaire == null || commentaire.getDiscussion() == null || !commentaire.getDiscussion().getId().equals(discussionId)) {
            return false;
        }

        commentaireRepository.deleteById(commentaireId);
        return true;
    }


    public boolean deleteCommentaireFromPost(Long postId, Long commentaireId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) return false;

        Commentaires commentaire = commentaireRepository.findById(commentaireId).orElse(null);
        if (commentaire == null || !commentaire.getPost().getId().equals(postId)) {
            return false;
        }

        commentaireRepository.deleteById(commentaireId);
        return true;
    }
}
