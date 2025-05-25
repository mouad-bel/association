package ma.association.service;


import ma.association.model.Evenement;
import ma.association.model.Like;
import ma.association.model.User;
import ma.association.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public boolean toggleLike(User user, Evenement evenement) {
        Optional<Like> existingLike = likeRepository.findByUserAndEvenement(user, evenement);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return false; // unliked
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setEvenement(evenement);
            like.setLikedAt(LocalDateTime.now());
            likeRepository.save(like);
            return true; // liked
        }
    }


    public long getLikeCount(Evenement evenement) {
        return likeRepository.countByEvenement(evenement);
    }

    public boolean hasUserLiked(User user, Evenement evenement) {
        return likeRepository.existsByUserAndEvenement(user, evenement);
    }
}
