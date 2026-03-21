package com.infosys.rideshare;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGeneratorTest {

    @Test
    public void generatePassword() throws java.io.IOException {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String encodedPassword = encoder.encode(rawPassword);
        java.nio.file.Files.writeString(java.nio.file.Path.of("hash.txt"), encodedPassword);
    }
}
