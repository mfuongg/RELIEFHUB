package com.reliefhub.service;

import com.reliefhub.dto.FileUploadDTO;
import com.reliefhub.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.max-size-mb:10}")
    private int maxSizeMb;

    public FileUploadDTO.FileUploadResponse upload(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("File không được để trống");
        if (file.getSize() > maxSizeMb * 1024 * 1024L)
            throw new BadRequestException("File quá lớn, tối đa " + maxSizeMb + "MB");

        try {
            Path dir = Paths.get(uploadDir);
            if (!Files.exists(dir)) Files.createDirectories(dir);

            String original = file.getOriginalFilename();
            String ext = original != null && original.contains(".")
                    ? original.substring(original.lastIndexOf(".")) : "";
            String fileName = UUID.randomUUID() + ext;
            Path target = dir.resolve(fileName);
            Files.copy(file.getInputStream(), target);

            return FileUploadDTO.FileUploadResponse.builder()
                    .fileName(fileName)
                    .url("/uploads/" + fileName)
                    .mimeType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .build();
        } catch (IOException e) {
            log.error("Upload failed", e);
            throw new BadRequestException("Lỗi khi upload file: " + e.getMessage());
        }
    }
}
