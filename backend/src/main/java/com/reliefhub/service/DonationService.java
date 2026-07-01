package com.reliefhub.service;

import com.reliefhub.dto.DonationDTO;
import com.reliefhub.entity.*;
import com.reliefhub.exception.BadRequestException;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.CampaignRepository;
import com.reliefhub.repository.DonationRepository;
import com.reliefhub.repository.UserRepository;
import com.reliefhub.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public List<DonationDTO.DonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DonationDTO.DonationResponse> getMyDonations() {
        CustomUserDetails userDetails = getCurrentUser();
        return donationRepository.findByUserId(userDetails.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DonationDTO.DonationResponse> getDonationsByCampaign(Long campaignId) {
        return donationRepository.findByCampaignId(campaignId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DonationDTO.DonationResponse createDonation(DonationDTO.CreateDonationRequest request) {
        CustomUserDetails userDetails = getCurrentUser();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", request.getCampaignId()));

        Donation donation = Donation.builder()
                .user(user)
                .campaign(campaign)
                .amount(request.getAmount())
                .message(request.getMessage())
                .isAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false)
                .status(Donation.DonationStatus.PENDING)
                .build();

        // Add item donations if provided
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            final Donation parentDonation = donation;
            List<DonationItem> items = request.getItems().stream()
                    .map(dto -> DonationItem.builder()
                            .donation(parentDonation)
                            .itemName(dto.getItemName())
                            .quantity(dto.getQuantity())
                            .unit(dto.getUnit())
                            .note(dto.getNote())
                            .build())
                    .collect(Collectors.toList());
            donation.setItems(items);
        }

        donation = donationRepository.save(donation);
        return toResponse(donation);
    }

    @Transactional
    public DonationDTO.DonationResponse updateDonationStatus(Long id, DonationDTO.UpdateDonationStatusRequest request) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation", "id", id));

        donation.setStatus(Donation.DonationStatus.valueOf(request.getStatus().toUpperCase()));
        donation = donationRepository.save(donation);

        // If confirmed, update campaign current_amount
        if (donation.getStatus() == Donation.DonationStatus.CONFIRMED && donation.getCampaign() != null) {
            Campaign campaign = donation.getCampaign();
            BigDecimal current = campaign.getCurrentAmount() != null ? campaign.getCurrentAmount() : BigDecimal.ZERO;
            campaign.setCurrentAmount(current.add(donation.getAmount()));
            campaignRepository.save(campaign);
        }

        return toResponse(donation);
    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private DonationDTO.DonationResponse toResponse(Donation d) {
        return DonationDTO.DonationResponse.builder()
                .id(d.getId())
                .userId(d.getUser() != null ? d.getUser().getId() : null)
                .donorName(d.getIsAnonymous() != null && d.getIsAnonymous()
                        ? "Ẩn danh"
                        : (d.getUser() != null ? d.getUser().getFullName() : null))
                .campaignId(d.getCampaign() != null ? d.getCampaign().getId() : null)
                .campaignTitle(d.getCampaign() != null ? d.getCampaign().getTitle() : null)
                .amount(d.getAmount())
                .message(d.getMessage())
                .isAnonymous(d.getIsAnonymous())
                .status(d.getStatus() != null ? d.getStatus().name() : "PENDING")
                .donatedAt(d.getDonatedAt() != null ? d.getDonatedAt().toString() : null)
                .items(d.getItems() != null ? d.getItems().stream()
                        .map(i -> DonationDTO.ItemDTO.builder()
                                .itemName(i.getItemName())
                                .quantity(i.getQuantity())
                                .unit(i.getUnit())
                                .note(i.getNote())
                                .build())
                        .collect(Collectors.toList())
                        : null)
                .build();
    }
}
