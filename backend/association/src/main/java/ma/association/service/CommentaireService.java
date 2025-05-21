package ma.association.service;

import ma.association.model.Commentaires;
import ma.association.model.Discussion;
import ma.association.model.Evenement;
import ma.association.model.User;
import ma.association.repository.CommentaireRepository;
import ma.association.repository.DiscussionRepository;
import ma.association.repository.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentaireService {

    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private EvenementRepository evenementRepository;
    @Autowired
    private DiscussionRepository discussionRepository;


    public List<Commentaires> getCommentairesForEvent(Long evenementId) {
        return commentaireRepository.findByEvenementId(evenementId);
    }


    public Commentaires addCommentaireToEvent(Long evenementId, Commentaires commentaire) {
        Evenement evenement = evenementRepository.findById(evenementId).orElse(null);
        if (evenement == null) return null;

        commentaire.setEvenement(evenement);
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
        commentaire.setEvenement(null); // ensure not attached to event
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


    public boolean deleteCommentaireFromEvent(Long evenementId, Long commentaireId) {
        Evenement evenement = evenementRepository.findById(evenementId).orElse(null);
        if (evenement == null) return false;

        Commentaires commentaire = commentaireRepository.findById(commentaireId).orElse(null);
        if (commentaire == null || !commentaire.getEvenement().getId().equals(evenementId)) {
            return false;
        }

        commentaireRepository.deleteById(commentaireId);
        return true;
    }
}
