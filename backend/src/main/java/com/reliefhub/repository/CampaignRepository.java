package com.reliefhub.repository;

import com.reliefhub.entity.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByStatus(Campaign.CampaignStatus status);
    Page<Campaign> findByStatus(Campaign.CampaignStatus status, Pageable pageable);
    List<Campaign> findByAreaContainingIgnoreCase(String area);
}
