package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.ComplaintDTO;
import com.reliefhub.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Khiếu nại / Phản ánh")
public class ComplaintController {
    private final ComplaintService complaintService;

    @GetMapping public ResponseEntity<ApiResponse<List<ComplaintDTO.ComplaintResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getAllComplaints()));
    }
    @GetMapping("/me") public ResponseEntity<ApiResponse<List<ComplaintDTO.ComplaintResponse>>> getMy() {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getMyComplaints()));
    }
    @PostMapping public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> create(@Valid @RequestBody ComplaintDTO.CreateComplaintRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã gửi khiếu nại", complaintService.createComplaint(req)));
    }
    @PutMapping("/{id}/reply") @Operation(summary = "Admin trả lời khiếu nại")
    public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> reply(@PathVariable Long id, @RequestBody ComplaintDTO.ReplyComplaintRequest req) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.replyComplaint(id, req)));
    }
    @PatchMapping("/{id}/close") @Operation(summary = "Đóng khiếu nại")
    public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.closeComplaint(id)));
    }
}
