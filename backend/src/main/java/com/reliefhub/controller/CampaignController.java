package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.CampaignDTO;
import com.reliefhub.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns", description = "Quản lý chiến dịch cứu trợ")
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả chiến dịch")
    public ResponseEntity<ApiResponse<List<CampaignDTO.CampaignResponse>>> getAllCampaigns() {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getAllCampaigns()));
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy danh sách chiến dịch đang hoạt động")
    public ResponseEntity<ApiResponse<List<CampaignDTO.CampaignResponse>>> getActiveCampaigns() {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getActiveCampaigns()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chiến dịch")
    public ResponseEntity<ApiResponse<CampaignDTO.CampaignResponse>> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getCampaignById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo chiến dịch mới (Admin only)")
    public ResponseEntity<ApiResponse<CampaignDTO.CampaignResponse>> createCampaign(@Valid @RequestBody CampaignDTO.CreateCampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo chiến dịch thành công", campaignService.createCampaign(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật chiến dịch (Admin only)")
    public ResponseEntity<ApiResponse<CampaignDTO.CampaignResponse>> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignDTO.UpdateCampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", campaignService.updateCampaign(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa chiến dịch (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa chiến dịch"));
    }
}
