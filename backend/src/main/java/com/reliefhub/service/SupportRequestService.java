package com.reliefhub.service;

import com.reliefhub.dto.SupportRequestDTO;
import com.reliefhub.entity.Campaign;
import com.reliefhub.entity.SupportRequest;
import com.reliefhub.entity.User;
import com.reliefhub.exception.BadRequestException;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.CampaignRepository;
import com.reliefhub.repository.SupportRequestRepository;
import com.reliefhub.repository.UserRepository;
import com.reliefhub.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;

    public List<SupportRequestDTO.SupportRequestResponse> getAllRequests() {
        return supportRequestRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SupportRequestDTO.SupportRequestResponse> getMyRequests() {
        CustomUserDetails userDetails = getCurrentUser();
        return supportRequestRepository.findByCitizenId(userDetails.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SupportRequestDTO.SupportRequestResponse> getRequestsByStatus(String status) {
        return supportRequestRepository.findByStatus(
                SupportRequest.RequestStatus.valueOf(status.toUpperCase())
        ).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupportRequestDTO.SupportRequestResponse createRequest(SupportRequestDTO.CreateSupportRequestRequest request) {
        CustomUserDetails userDetails = getCurrentUser();
        User citizen = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        Campaign campaign = null;
        if (request.getCampaignId() != null) {
            campaign = campaignRepository.findById(request.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", request.getCampaignId()));
        }

        SupportRequest sr = SupportRequest.builder()
                .citizen(citizen)
                .campaign(campaign)
                .requestCode("REQ-" + System.currentTimeMillis())
                .itemName(request.getItemName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .area(request.getArea())
                .urgency(request.getUrgency() != null
                        ? SupportRequest.Urgency.valueOf(request.getUrgency().toUpperCase())
                        : SupportRequest.Urgency.MEDIUM)
                .reason(request.getReason())
                .householdCount(request.getHouseholdCount() != null ? request.getHouseholdCount() : 1)
                .status(SupportRequest.RequestStatus.PENDING)
                .build();

        sr = supportRequestRepository.save(sr);
        return toResponse(sr);
    }

    @Transactional
    public SupportRequestDTO.SupportRequestResponse advanceStatus(Long id, SupportRequestDTO.AdvanceStatusRequest request) {
        SupportRequest sr = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SupportRequest", "id", id));

        SupportRequest.RequestStatus newStatus = SupportRequest.RequestStatus.valueOf(
                request.getNewStatus().toUpperCase()
        );

        sr.setStatus(newStatus);
        if (request.getNote() != null) {
            sr.setNotes(request.getNote());
        }

        sr = supportRequestRepository.save(sr);
        return toResponse(sr);
    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private SupportRequestDTO.SupportRequestResponse toResponse(SupportRequest sr) {
        return SupportRequestDTO.SupportRequestResponse.builder()
                .id(sr.getId())
                .requestCode(sr.getRequestCode())
                .citizenId(sr.getCitizen() != null ? sr.getCitizen().getId() : null)
                .citizenName(sr.getCitizen() != null ? sr.getCitizen().getFullName() : null)
                .campaignId(sr.getCampaign() != null ? sr.getCampaign().getId() : null)
                .itemName(sr.getItemName())
                .quantity(sr.getQuantity())
                .unit(sr.getUnit())
                .area(sr.getArea())
                .urgency(sr.getUrgency() != null ? sr.getUrgency().name() : "MEDIUM")
                .reason(sr.getReason())
                .householdCount(sr.getHouseholdCount())
                .status(sr.getStatus() != null ? sr.getStatus().name() : "PENDING")
                .notes(sr.getNotes())
                .createdAt(sr.getCreatedAt() != null ? sr.getCreatedAt().toString() : null)
                .build();
    }
}
