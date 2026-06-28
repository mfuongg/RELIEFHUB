package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.LedgerDTO;
import com.reliefhub.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ledger")
@RequiredArgsConstructor
@Tag(name = "Ledger", description = "Sổ tài chính")
public class LedgerController {
    private final LedgerService service;

    @GetMapping
    @Operation(summary = "Lấy danh sách bút toán sổ cái")
    public ResponseEntity<ApiResponse<List<LedgerDTO.LedgerResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll()));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<List<LedgerDTO.LedgerResponse>>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByCampaign(campaignId)));
    }

    @PostMapping
    @Operation(summary = "Tạo bút toán sổ cái mới")
    public ResponseEntity<ApiResponse<LedgerDTO.LedgerResponse>> create(@Valid @RequestBody LedgerDTO.CreateLedgerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã ghi bút toán", service.create(req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa bút toán"));
    }
}
