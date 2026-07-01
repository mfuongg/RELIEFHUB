package com.reliefhub.service;

import com.reliefhub.dto.DashboardDTO;
import com.reliefhub.entity.Campaign;
import com.reliefhub.entity.Donation;
import com.reliefhub.entity.Disaster;
import com.reliefhub.entity.SupportRequest;
import com.reliefhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final DisasterRepository disasterRepository;
    private final SupportRequestRepository supportRequestRepository;
    private final VolunteerRepository volunteerRepository;
    private final DeliveryRepository deliveryRepository;

    public DashboardDTO.DashboardStats getStats() {
        long totalUsers = userRepository.count();
        long totalCampaigns = campaignRepository.count();
        long activeCampaigns = campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE).size();
        long activeDisasters = disasterRepository.findByStatus(Disaster.DisasterStatus.ACTIVE).size();
        long totalVolunteers = volunteerRepository.count();
        long pendingRequests = supportRequestRepository
                .findByStatus(SupportRequest.RequestStatus.PENDING).size();
        long totalRequests = supportRequestRepository.count();
        long totalDelivered = deliveryRepository
                .findByStatus(com.reliefhub.entity.Delivery.DeliveryStatus.DELIVERED).size();

        List<Donation> confirmedDonations = donationRepository
                .findByStatus(Donation.DonationStatus.CONFIRMED);
        BigDecimal totalDonations = confirmedDonations.stream()
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardDTO.DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalCampaigns(totalCampaigns)
                .activeCampaigns(activeCampaigns)
                .totalDonations(totalDonations)
                .totalDonationCount((long) confirmedDonations.size())
                .activeDisasters(activeDisasters)
                .totalVolunteers(totalVolunteers)
                .pendingSupportRequests(pendingRequests)
                .totalSupportRequests(totalRequests)
                .totalDelivered(totalDelivered)
                .build();
    }
}
