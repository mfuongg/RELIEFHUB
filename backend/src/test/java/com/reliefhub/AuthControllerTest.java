package com.reliefhub;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliefhub.dto.AuthDTO;
import com.reliefhub.entity.Role;
import com.reliefhub.entity.User;
import com.reliefhub.repository.RoleRepository;
import com.reliefhub.repository.UserRepository;
import com.reliefhub.security.JwtTokenProvider;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@Transactional
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        Role adminRole = roleRepository.findByName("admin")
                .orElseGet(() -> roleRepository.save(Role.builder().name("admin").description("Admin").build()));
        roleRepository.findByName("citizen")
                .orElseGet(() -> roleRepository.save(Role.builder().name("citizen").description("Citizen").build()));

        if (!userRepository.existsByUsername("testadmin")) {
            userRepository.save(User.builder()
                    .fullName("Test Admin")
                    .username("testadmin")
                    .email("testadmin@test.com")
                    .password(passwordEncoder.encode("test123"))
                    .status(User.UserStatus.ACTIVE)
                    .role(adminRole)
                    .build());
        }
    }

    @Test
    @DisplayName("Login thành công với tài khoản hợp lệ")
    void login_success() throws Exception {
        AuthDTO.LoginRequest req = AuthDTO.LoginRequest.builder()
                .username("testadmin").password("test123").build();

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.username").value("testadmin"))
                .andExpect(jsonPath("$.data.role").value("admin"));
    }

    @Test
    @DisplayName("Login thất bại với sai mật khẩu")
    void login_wrongPassword() throws Exception {
        AuthDTO.LoginRequest req = AuthDTO.LoginRequest.builder()
                .username("testadmin").password("wrongpassword").build();

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Register thành công với thông tin hợp lệ")
    void register_success() throws Exception {
        AuthDTO.RegisterRequest req = AuthDTO.RegisterRequest.builder()
                .fullName("New User")
                .username("newuser")
                .email("newuser@test.com")
                .password("pass123")
                .phone("0901234567")
                .roleName("citizen")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("newuser"))
                .andExpect(jsonPath("$.data.role").value("citizen"));
    }

    @Test
    @DisplayName("Register thất bại với username đã tồn tại")
    void register_duplicateUsername() throws Exception {
        AuthDTO.RegisterRequest req = AuthDTO.RegisterRequest.builder()
                .fullName("Dup User")
                .username("testadmin")
                .email("dup@test.com")
                .password("pass123")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("JWT token generate và validate thành công")
    void jwtToken_valid() {
        String token = tokenProvider.generateTokenFromUsername("testadmin");
        Assertions.assertTrue(tokenProvider.validateToken(token));
        Assertions.assertEquals("testadmin", tokenProvider.getUsernameFromToken(token));
    }
}
