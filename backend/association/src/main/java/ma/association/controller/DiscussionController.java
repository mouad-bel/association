package ma.association.controller;

import ma.association.model.Discussion;
import ma.association.service.DiscussionService;
import ma.association.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/discussions")
@CrossOrigin("http://localhost:5173")
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;



    @PostMapping
    public ResponseEntity<Discussion> createDiscussion(@RequestBody Discussion discussion) {

        Discussion created = discussionService.createDiscussion(discussion);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Discussion>> getAllDiscussions() {
        return ResponseEntity.ok(discussionService.getAllDiscussions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discussion> getDiscussionById(@PathVariable Long id) {
        Discussion discussion = discussionService.getDiscussionById(id);
        if (discussion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(discussion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discussion> updateDiscussion(@PathVariable Long id, @RequestBody Discussion discussion) {
        Discussion existing = discussionService.getDiscussionById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        discussion.setId(id);
        Discussion updated = discussionService.updateDiscussion(discussion);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable Long id) {
        discussionService.deleteDiscussion(id);
        return ResponseEntity.noContent().build();
    }
}
