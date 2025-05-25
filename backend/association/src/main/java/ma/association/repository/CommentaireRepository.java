package ma.association.repository;

import ma.association.model.Commentaires;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentaireRepository extends JpaRepository<Commentaires, Long> {
    List<Commentaires> findByPostId(Long evenementid);
    List<Commentaires> findByDiscussionId(Long discussionId);
}
