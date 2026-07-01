package com.reliefhub.service;

import com.reliefhub.dto.CampaignDTO;
import com.reliefhub.entity.Campaign;
import com.reliefhub.entity.CampaignCategory;
import com.reliefhub.exception.BadRequestException;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public List<CampaignDTO.CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CampaignDTO.CampaignResponse> getActiveCampaigns() {
        return campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CampaignDTO.CampaignResponse getCampaignById(Long id) {
        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", id));
        return toResponse(c);
    }

    @Transactional
    public CampaignDTO.CampaignResponse createCampaign(CampaignDTO.CreateCampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .currentAmount(BigDecimal.ZERO)
                .startDate(request.getStartDate() != null ? LocalDate.parse(request.getStartDate()) : null)
                .endDate(request.getEndDate() != null ? LocalDate.parse(request.getEndDate()) : null)
                .status(request.getStatus() != null
                        ? Campaign.CampaignStatus.valueOf(request.getStatus().toUpperCase())
                        : Campaign.CampaignStatus.ACTIVE)
                .area(request.getArea())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        campaign = campaignRepository.save(campaign);
        return toResponse(campaign);
    }

    @Transactional
    public CampaignDTO.CampaignResponse updateCampaign(Long id, CampaignDTO.UpdateCampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", id));

        if (request.getTitle() != null) campaign.setTitle(request.getTitle());
        if (request.getDescription() != null) campaign.setDescription(request.getDescription());
        if (request.getTargetAmount() != null) campaign.setTargetAmount(request.getTargetAmount());
        if (request.getStartDate() != null) campaign.setStartDate(LocalDate.parse(request.getStartDate()));
        if (request.getEndDate() != null) campaign.setEndDate(LocalDate.parse(request.getEndDate()));
        if (request.getStatus() != null) {
            campaign.setStatus(Campaign.CampaignStatus.valueOf(request.getStatus().toUpperCase()));
        }
        if (request.getArea() != null) campaign.setArea(request.getArea());
        if (request.getThumbnailUrl() != null) campaign.setThumbnailUrl(request.getThumbnailUrl());

        campaign = campaignRepository.save(campaign);
        return toResponse(campaign);
    }

    @Transactional
    public void deleteCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", id));
        campaignRepository.delete(campaign);
    }

    private CampaignDTO.CampaignResponse toResponse(Campaign c) {
        BigDecimal current = c.getCurrentAmount() != null ? c.getCurrentAmount() : BigDecimal.ZERO;
        BigDecimal target = c.getTargetAmount() != null ? c.getTargetAmount() : BigDecimal.ZERO;
        Double progressPct = target.compareTo(BigDecimal.ZERO) > 0
                ? current.multiply(BigDecimal.valueOf(100))
                    .divide(target, 1, RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        return CampaignDTO.CampaignResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategoryId() != null ? "Category #" + c.getCategoryId() : null)
                .targetAmount(target)
                .currentAmount(current)
                .progressPct(progressPct)
                .status(c.getStatus() != null ? c.getStatus().name() : "DRAFT")
                .area(c.getArea())
                .startDate(c.getStartDate() != null ? c.getStartDate().toString() : null)
                .endDate(c.getEndDate() != null ? c.getEndDate().toString() : null)
                .thumbnailUrl(c.getThumbnailUrl())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null)
                .build();
    }
}
