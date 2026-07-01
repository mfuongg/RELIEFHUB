package com.reliefhub.config;

import com.reliefhub.entity.User;
import com.reliefhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        int updated = 0;
        for (User user : users) {
            // If password is not a BCrypt hash (doesn't start with $2a$), hash it
            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                updated++;
            }
        }
        if (updated > 0) {
            log.info("DataInitializer: Đã hash BCrypt cho {} tài khoản mặc định", updated);
        }
    }
}
