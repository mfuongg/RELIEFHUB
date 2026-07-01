package com.reliefhub;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliefhub.dto.CampaignDTO;
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

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
class CampaignControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;

    private String adminToken;
    private String donorToken;

    @BeforeEach
    void setUp() {
        Role adminRole = roleRepository.findByName("admin")
                .orElseGet(() -> roleRepository.save(Role.builder().name("admin").build()));
        Role donorRole = roleRepository.findByName("donor")
                .orElseGet(() -> roleRepository.save(Role.builder().name("donor").build()));

        if (!userRepository.existsByUsername("admin_test")) {
            userRepository.save(User.builder()
                    .fullName("Admin").username("admin_test")
                    .email("admin@test.com").password(passwordEncoder.encode("pass"))
                    .status(User.UserStatus.ACTIVE).role(adminRole).build());
        }
        if (!userRepository.existsByUsername("donor_test")) {
            userRepository.save(User.builder()
                    .fullName("Donor").username("donor_test")
                    .email("donor@test.com").password(passwordEncoder.encode("pass"))
                    .status(User.UserStatus.ACTIVE).role(donorRole).build());
        }

        adminToken = tokenProvider.generateTokenFromUsername("admin_test");
        donorToken = tokenProvider.generateTokenFromUsername("donor_test");
    }

    @Test
    @DisplayName("Admin tạo campaign thành công")
    void adminCreateCampaign() throws Exception {
        CampaignDTO.CreateCampaignRequest req = CampaignDTO.CreateCampaignRequest.builder()
                .title("Test Campaign")
                .description("Test Description")
                .targetAmount(new BigDecimal("100000000"))
                .status("ACTIVE")
                .area("Hà Nội")
                .build();

        mockMvc.perform(post("/campaigns")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Test Campaign"))
                .andExpect(jsonPath("$.data.area").value("Hà Nội"));
    }

    @Test
    @DisplayName("Donor tạo campaign bị từ chối (403)")
    void donorCannotCreateCampaign() throws Exception {
        CampaignDTO.CreateCampaignRequest req = CampaignDTO.CreateCampaignRequest.builder()
                .title("Test").targetAmount(new BigDecimal("100")).build();

        mockMvc.perform(post("/campaigns")
                        .header("Authorization", "Bearer " + donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /campaigns không cần token (public)")
    void getCampaignsPublic() throws Exception {
        mockMvc.perform(get("/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Truy cập không token bị 401")
    void accessWithoutToken() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isUnauthorized());
    }
}
