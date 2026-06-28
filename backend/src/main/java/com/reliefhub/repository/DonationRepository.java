package com.reliefhub.repository;

import com.reliefhub.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserId(Long userId);
    List<Donation> findByCampaignId(Long campaignId);
    List<Donation> findByStatus(Donation.DonationStatus status);
}
