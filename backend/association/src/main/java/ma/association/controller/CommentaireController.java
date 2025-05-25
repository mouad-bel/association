package ma.association.controller;

import ma.association.model.Commentaires;
import ma.association.service.CommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@CrossOrigin("http://localhost:5174")
public class CommentaireController {

    @Autowired
    private CommentaireService commentaireService;

    // ------------------ EVENT COMMENTS ------------------

    @GetMapping("/post/{postId}/commentaires")
    public ResponseEntity<List<Commentaires>> getCommentairesForPost(@PathVariable Long postId) {
        List<Commentaires> commentaires = commentaireService.getCommentairesForPost(postId);
        return ResponseEntity.ok(commentaires);
    }

    @PostMapping("/Post/{postId}/commentaires")
    public ResponseEntity<Commentaires> addCommentaireToPost(@PathVariable Long postId,
                                                              @RequestBody Commentaires commentaire) {
        Commentaires saved = commentaireService.addCommentaireToPost(postId, commentaire);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/Post/{postId}/commentaires/{commentaireId}")
    public ResponseEntity<Void> deleteCommentaireFromPost(@PathVariable Long postId,
                                                           @PathVariable Long commentaireId) {
        boolean deleted = commentaireService.deleteCommentaireFromPost(postId, commentaireId);
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
