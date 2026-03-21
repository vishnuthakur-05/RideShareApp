package com.infosys.rideshare;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.infosys.rideshare.repository.UserRepository;
import com.infosys.rideshare.entity.User;
import java.util.Optional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class VerifyPasswordTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void verify() {
        Optional<User> userOpt = userRepository.findByEmail("admin@rideshare.com");
        if (userOpt.isPresent()) {
            System.out.println("USER_FOUND: " + userOpt.get().getEmail());
            System.out.println("STORED_HASH: " + userOpt.get().getPassword());
            boolean matches = passwordEncoder.matches("admin123", userOpt.get().getPassword());
            System.out.println("HASH_MATCH: " + matches);
        } else {
            System.out.println("USER_FOUND: false");
        }
    }
}
