package com.reliefhub.dto;

import lombok.*;
import java.math.BigDecimal;

public class DashboardDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DashboardStats {
        private Long totalUsers;
        private Long totalCampaigns;
        private Long activeCampaigns;
        private BigDecimal totalDonations;
        private Long totalDonationCount;
        private Long activeDisasters;
        private Long totalVolunteers;
        private Long pendingSupportRequests;
        private Long totalSupportRequests;
        private Long totalDelivered;
    }
}
