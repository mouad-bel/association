package ma.association.service;

import ma.association.model.Discussion;
import ma.association.repository.DiscussionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscussionService {

    @Autowired
    private DiscussionRepository discussionRepository;

    public Discussion createDiscussion(Discussion discussion) {
        return discussionRepository.save(discussion);
    }

    public List<Discussion> getAllDiscussions() {
        return discussionRepository.findAll();
    }

    public Discussion getDiscussionById(Long id) {
        return discussionRepository.findById(id).orElse(null);
    }

    public Discussion updateDiscussion(Discussion discussion) {
        return discussionRepository.save(discussion);
    }

    public void deleteDiscussion(Long id) {
        discussionRepository.deleteById(id);
    }
}
