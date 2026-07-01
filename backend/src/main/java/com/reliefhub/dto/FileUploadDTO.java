package com.reliefhub.dto;

import lombok.*;

public class FileUploadDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FileUploadResponse {
        private String fileName;
        private String url;
        private String mimeType;
        private Long sizeBytes;
    }
}
