package ma.association.controller;

import ma.association.model.Commentaires;
import ma.association.service.CommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@CrossOrigin("http://localhost:5173")
public class CommentaireController {

    @Autowired
    private CommentaireService commentaireService;

    // ------------------ EVENT COMMENTS ------------------

    @GetMapping("/evenements/{evenementId}/commentaires")
    public ResponseEntity<List<Commentaires>> getCommentairesForEvent(@PathVariable Long evenementId) {
        List<Commentaires> commentaires = commentaireService.getCommentairesForEvent(evenementId);
        return ResponseEntity.ok(commentaires);
    }

    @PostMapping("/evenements/{evenementId}/commentaires")
    public ResponseEntity<Commentaires> addCommentaireToEvent(@PathVariable Long evenementId,
                                                              @RequestBody Commentaires commentaire) {
        Commentaires saved = commentaireService.addCommentaireToEvent(evenementId, commentaire);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/evenements/{evenementId}/commentaires/{commentaireId}")
    public ResponseEntity<Void> deleteCommentaireFromEvent(@PathVariable Long evenementId,
                                                           @PathVariable Long commentaireId) {
        boolean deleted = commentaireService.deleteCommentaireFromEvent(evenementId, commentaireId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ------------------ DISCUSSION COMMENTS ------------------

    @GetMapping("/discussions/{discussionId}/commentaires")
    public ResponseEntity<List<Commentaires>> getCommentairesForDiscussion(@PathVariable Long discussionId) {
        List<Commentaires> commentaires = commentaireService.getCommentairesForDiscussion(discussionId);
        return ResponseEntity.ok(commentaires);
    }

    @PostMapping("/discussions/{discussionId}/commentaires")
    public ResponseEntity<Commentaires> addCommentaireToDiscussion(@PathVariable Long discussionId,
                                                                   @RequestBody Commentaires commentaire) {
        Commentaires saved = commentaireService.addCommentaireToDiscussion(discussionId, commentaire);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/discussions/{discussionId}/commentaires/{commentaireId}")
    public ResponseEntity<Void> deleteCommentaireFromDiscussion(@PathVariable Long discussionId,
                                                                @PathVariable Long commentaireId) {
        boolean deleted = commentaireService.deleteCommentaireFromDiscussion(discussionId, commentaireId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
