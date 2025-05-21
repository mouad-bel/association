package ma.association.controller;

import ma.association.DTO.LoginRequest;
import ma.association.model.User;
import ma.association.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    ResponseEntity<String> newUser(@RequestBody User newUser ){
        return userService.newUser(newUser);
    }

    @GetMapping("/users")
    List<User> getUsers(){
        return userService.getUsers();
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id){
         return userService.deleteUser(id);
    }

    @PatchMapping("/user/{id}")
    String blockUser(@PathVariable Long id){
        return userService.blockUser(id);


    }

    @PostMapping("/login")
    ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest){
        return userService.authenticateUser(loginRequest);
    }

}
