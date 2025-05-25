package ma.association.repository;

import ma.association.model.Post;
import ma.association.model.Like;
import ma.association.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like,Long> {
    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    long countByPost(Post post);
    Optional<Like> findByUserAndPost(User user, Post post);

}
