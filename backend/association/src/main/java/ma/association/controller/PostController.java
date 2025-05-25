package ma.association.controller;

import ma.association.DTO.PostDTO;
import ma.association.DTO.PostResponseDTO;
import ma.association.DTO.UserDTO;
import ma.association.model.Post;
import ma.association.model.User;
import ma.association.service.PostService;
import ma.association.service.LikeService;
import ma.association.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/post")
@CrossOrigin("http://localhost:5174")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private UserService userService;
    @Autowired
    private LikeService likeService;

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();

        List<PostResponseDTO> responseDTOs = posts.stream().map(ev -> {
            User user = ev.getUser();
            UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFirstName(),user.getPhone(),user.getLastName());
            long likeCount = likeService.getLikeCount(ev);
            return new PostResponseDTO(
                    ev.getId(),
                    ev.getTitre(),
                    ev.getDescription(),
                    ev.getDate(),
                    ev.getPieceJoint(),
                       likeCount,
                       userDTO

            );
        }).toList();

        return ResponseEntity.ok(responseDTOs);
    }


    @PostMapping(value = "/newPost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> createPost(
            @ModelAttribute PostDTO dto) throws IOException {

        Post post = new Post();
        post.setTitre(dto.getTitre());
        post.setDescription(dto.getDescription());
        post.setDate(dto.getDate());

        // 👉 Handle user
        if (dto.getUser() != null && dto.getUser().getId() != null) {
            User user = userService.getUserById(dto.getUser().getId());
            post.setUser(user);
        } else {
            return ResponseEntity.badRequest().body(null); // Or return a custom error message
        }

        // 👉 Handle image
        MultipartFile image = dto.getImage();
        if (image != null && !image.isEmpty()) {
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");
            Files.createDirectories(uploadPath);
            Files.copy(image.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            post.setPieceJoint(filename);
        }

        Post saved = postService.createPost(post);
        return ResponseEntity.ok(saved);
    }



    @GetMapping("/{id}")

    public ResponseEntity<Post> getPostById(@PathVariable Long id){
        Post post = postService.getPostById(id);
        if(post == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        if (post != null) {
            postService.deletePost(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
    @PostMapping("/{id}/like")
    public ResponseEntity<String> likeOrUnlikePost(@PathVariable Long id, @RequestParam Long userId) {
        Post post = postService.getPostById(id);
        User user = userService.getUserById(userId);

        boolean liked = likeService.toggleLike(user, post);
        return ResponseEntity.ok(liked ? "Post liked" : "Post unliked");
    }
    @GetMapping("/{id}/likes/count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        long count = likeService.getLikeCount(post);
        return ResponseEntity.ok(count);
    }

}
