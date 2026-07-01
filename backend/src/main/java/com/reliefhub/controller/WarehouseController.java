package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.WarehouseDTO;
import com.reliefhub.service.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Quản lý kho")
public class WarehouseController {
    private final WarehouseService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WarehouseDTO.WarehouseResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WarehouseDTO.WarehouseResponse>> create(@Valid @RequestBody WarehouseDTO.CreateWarehouseRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Tạo kho thành công", service.create(req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa kho"));
    }
}
