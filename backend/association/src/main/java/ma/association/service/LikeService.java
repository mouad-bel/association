package ma.association.service;


import ma.association.model.Post;
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

    public boolean toggleLike(User user, Post post) {
        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return false; // unliked
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setLikedAt(LocalDateTime.now());
            likeRepository.save(like);
            return true; // liked
        }
    }


    public long getLikeCount(Post post) {
        return likeRepository.countByPost(post);
    }

    public boolean hasUserLiked(User user, Post post) {
        return likeRepository.existsByUserAndPost(user, post);
    }
}
