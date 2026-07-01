package com.reliefhub.repository;

import com.reliefhub.entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByCampaignId(Long campaignId);
    List<Ledger> findByType(Ledger.LedgerType type);
}
