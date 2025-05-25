package ma.association.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvenementResponseDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime date;
    private String pieceJoint;
    private Long LikesCount;
    private UserDTO user;

}
