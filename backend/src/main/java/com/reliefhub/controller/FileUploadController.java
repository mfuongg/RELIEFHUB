package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.FileUploadDTO;
import com.reliefhub.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "Upload ảnh minh chứng và tài liệu")
public class FileUploadController {
    private final FileUploadService uploadService;

    @PostMapping
    @Operation(summary = "Upload file (ảnh, tài liệu)")
    public ResponseEntity<ApiResponse<FileUploadDTO.FileUploadResponse>> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Upload thành công", uploadService.upload(file)));
    }
}
