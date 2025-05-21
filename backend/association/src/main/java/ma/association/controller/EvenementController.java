package ma.association.controller;

import ma.association.DTO.EvenementDTO;
import ma.association.DTO.EvenementResponseDTO;
import ma.association.DTO.UserDTO;
import ma.association.model.Evenement;
import ma.association.model.User;
import ma.association.service.EvenementService;
import ma.association.service.UserService;
import ma.association.service.UserServiceImpl;
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
@RequestMapping("api/evenements")
@CrossOrigin("http://localhost:5173")
public class EvenementController {
    @Autowired
    private EvenementService evenementService;
    @Autowired
    private UserService userService;

    @GetMapping("/events")
    public ResponseEntity<List<EvenementResponseDTO>> getAllEvenements() {
        List<Evenement> evenements = evenementService.getAllEvenements();

        List<EvenementResponseDTO> responseDTOs = evenements.stream().map(ev -> {
            User user = ev.getUser();
            UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getFirstName(),user.getPhone(),user.getLastName());

            return new EvenementResponseDTO(
                    ev.getId(),
                    ev.getTitre(),
                    ev.getDescription(),
                    ev.getDate(),
                    ev.getPieceJoint(),
                    userDTO
            );
        }).toList();

        return ResponseEntity.ok(responseDTOs);
    }


    @PostMapping(value = "/newEvent", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Evenement> createEvenement(
            @ModelAttribute EvenementDTO dto) throws IOException {

        Evenement evenement = new Evenement();
        evenement.setTitre(dto.getTitre());
        evenement.setDescription(dto.getDescription());
        evenement.setDate(dto.getDate());

        // 👉 Handle user
        if (dto.getUser() != null && dto.getUser().getId() != null) {
            User user = userService.getUserById(dto.getUser().getId());
            evenement.setUser(user);
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
            evenement.setPieceJoint(filename);
        }

        Evenement saved = evenementService.createEvenement(evenement);
        return ResponseEntity.ok(saved);
    }



    @GetMapping("/{id}")

    public ResponseEntity<Evenement> getEvenementById(@PathVariable Long id){
        Evenement evenement = evenementService.getEvenementById(id);
        if(evenement == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(evenement);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        Evenement evenement = evenementService.getEvenementById(id);
        if (evenement != null) {
            evenementService.deleteEvenement(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
