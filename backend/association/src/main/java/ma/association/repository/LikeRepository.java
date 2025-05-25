package ma.association.repository;

import ma.association.model.Evenement;
import ma.association.model.Like;
import ma.association.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like,Long> {
    boolean existsByUserAndEvenement(User user, Evenement evenement);
    void deleteByUserAndEvenement(User user, Evenement evenement);
    long countByEvenement(Evenement evenement);
    Optional<Like> findByUserAndEvenement(User user, Evenement evenement);

}
