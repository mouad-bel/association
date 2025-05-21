package ma.association.service;


import ma.association.DTO.LoginRequest;
import ma.association.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UserService {
    User getUserById(Long id);
    List<User> getUsers();
     ResponseEntity<String> newUser(User newUser );
    String deleteUser( Long id);
    String blockUser( Long id);
    ResponseEntity<Map<String, Object>> authenticateUser(LoginRequest loginRequest);


}
