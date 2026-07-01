package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.DonationDTO;
import com.reliefhub.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Quản lý đóng góp")
public class DonationController {
    private final DonationService donationService;

    @GetMapping public ResponseEntity<ApiResponse<List<DonationDTO.DonationResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(donationService.getAllDonations()));
    }
    @GetMapping("/me") @Operation(summary = "Lịch sử đóng góp của tôi")
    public ResponseEntity<ApiResponse<List<DonationDTO.DonationResponse>>> getMyDonations() {
        return ResponseEntity.ok(ApiResponse.success(donationService.getMyDonations()));
    }
    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<List<DonationDTO.DonationResponse>>> getByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(ApiResponse.success(donationService.getDonationsByCampaign(campaignId)));
    }
    @PostMapping @Operation(summary = "Tạo đóng góp mới")
    public ResponseEntity<ApiResponse<DonationDTO.DonationResponse>> create(@Valid @RequestBody DonationDTO.CreateDonationRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã ghi nhận đóng góp", donationService.createDonation(req)));
    }
    @PatchMapping("/{id}/status") @Operation(summary = "Cập nhật trạng thái (Finance/Admin)")
    public ResponseEntity<ApiResponse<DonationDTO.DonationResponse>> updateStatus(@PathVariable Long id, @RequestBody DonationDTO.UpdateDonationStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success(donationService.updateDonationStatus(id, req)));
    }
}
