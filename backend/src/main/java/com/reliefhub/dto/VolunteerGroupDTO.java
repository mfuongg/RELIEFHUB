package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class VolunteerGroupDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GroupResponse {
        private Long id;
        private String name;
        private String leaderName;
        private String area;
        private String description;
        private String status;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateGroupRequest {
        @NotBlank
        private String name;
        private String area;
        private String description;
        private String status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateGroupRequest {
        private String name;
        private String area;
        private String description;
        private String status;
    }
}
