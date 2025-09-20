package TabletopNexus.Login.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import TabletopNexus.Login.Classes.Credentials;
import TabletopNexus.Login.Classes.User;
import TabletopNexus.Login.Services.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping(path = "/register")
    public ResponseEntity<String> CreateAccount(@RequestBody User user, HttpServletResponse response){
       String token = loginService.register(user);
       if (!token.equals("username in use") && !token.equals("password not complex")) {
           Cookie cookie = new Cookie("AuthToken", token);
           cookie.setMaxAge(8400);
           cookie.setPath("/");
           response.addCookie(cookie);
           Cookie username = new Cookie("username", user.getUsername());
           username.setMaxAge(8400);
           username.setPath("/");
           response.addCookie(username);
           return new ResponseEntity<>("Congratulations You are Registered", HttpStatus.CREATED);
       }
       else return new ResponseEntity<>(token,HttpStatus.CONFLICT);
    }

    @PostMapping(path = "/login")
    public ResponseEntity<String> login(@RequestBody Credentials namepass, HttpServletResponse response){
        String token = loginService.logIn(namepass);
        if (!token.equals("User Not Found") && !token.equals("Password Doesn't Match")) {
            Cookie cookie = new Cookie("AuthToken", token);
            cookie.setMaxAge(8400);
            cookie.setPath("/");
            response.addCookie(cookie);
            Cookie username = new Cookie("username", namepass.getCredFieldOne());
            username.setMaxAge(8400);
            username.setPath("/");
            response.addCookie(username);
            return new ResponseEntity<>(token, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(token,HttpStatus.CONFLICT);
        }

    }

    @GetMapping(path = "/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username,
                                        @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                        @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        System.out.println("GetUser Has been Reached");
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        }

        return new ResponseEntity<>(loginService.getUserInfo(username, token), HttpStatus.OK);
    }
    @GetMapping(path = "/logout/{username}")
    public ResponseEntity<String> logout(@PathVariable String username,
                                         @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                         @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        }
        loginService.logout(username, token);

        return new ResponseEntity<>("Log out Successful", HttpStatus.OK);
    }

    @PutMapping(path = "/changePassword/{username}")
    @ResponseStatus(code = HttpStatus.OK)
    public String changePassword(@PathVariable String username, @RequestBody Credentials credentials,
                                 @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                 @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        // This endpoint currently does not use the token value in the service method, so we simply forward the request
        return loginService.changePassword(username, credentials);
    }

    @DeleteMapping(path = "/delete/{username}")
    public ResponseEntity<String> deleteAccount(@PathVariable String username,
                                                @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                                @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
                                                @RequestParam String password) {

        password = password.trim();
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        }

        String result = loginService.deleteUser(username, password, token);

        if (!result.equals("Password Doesn't Match") && !result.equals("Account Doesn't Exist")) {
            return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(result, HttpStatus.CONFLICT);
        }
    }

    @GetMapping(path = "/{username}/characters")
    public ResponseEntity<List<UUID>> characters(@PathVariable String username,
                                                 @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                                 @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
                                                 @CookieValue(value = "AuthToken", required = false) String authCookie) {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        } else if (authCookie != null) {
            token = authCookie;
        }
        List<UUID> characterIDs = loginService.getUserCharacters(username);

        return new ResponseEntity<>(characterIDs, HttpStatus.OK);
    }

    @PostMapping(path = "/{username}/character")
    public ResponseEntity<String> addCharacter(@PathVariable String username,
                                               @RequestParam UUID characterId,
                                               @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                               @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        }

        loginService.addCharacter(username, characterId, token);

        return new ResponseEntity<>("Added", HttpStatus.OK);
    }

    @DeleteMapping(path = "/{username}/character")
    public ResponseEntity<String> deleteCharacter(@PathVariable String username,
                                                  @RequestParam UUID characterId,
                                                  @RequestParam(value = "AuthToken", required = false) String authTokenParam,
                                                  @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else if (authTokenParam != null) {
            token = authTokenParam;
        }

        loginService.deleteCharacter(username, characterId, token);

        return new ResponseEntity<>("Deleted", HttpStatus.OK);
    }
}


