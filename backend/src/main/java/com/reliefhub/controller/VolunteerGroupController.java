package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.VolunteerGroupDTO;
import com.reliefhub.service.VolunteerGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/volunteer-groups")
@RequiredArgsConstructor
@Tag(name = "Volunteer Groups", description = "Quản lý nhóm tình nguyện")
public class VolunteerGroupController {
    private final VolunteerGroupService service;

    @GetMapping
    @Operation(summary = "Lấy danh sách nhóm tình nguyện")
    public ResponseEntity<ApiResponse<List<VolunteerGroupDTO.GroupResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VolunteerGroupDTO.GroupResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(service.getActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VolunteerGroupDTO.GroupResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo nhóm tình nguyện mới")
    public ResponseEntity<ApiResponse<VolunteerGroupDTO.GroupResponse>> create(@Valid @RequestBody VolunteerGroupDTO.CreateGroupRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Tạo nhóm thành công", service.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VolunteerGroupDTO.GroupResponse>> update(@PathVariable Long id, @RequestBody VolunteerGroupDTO.UpdateGroupRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", service.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa nhóm"));
    }
}
