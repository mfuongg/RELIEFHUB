package com.reliefhub.service;

import com.reliefhub.dto.LedgerDTO;
import com.reliefhub.entity.Campaign;
import com.reliefhub.entity.Ledger;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.CampaignRepository;
import com.reliefhub.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LedgerService {
    private final LedgerRepository ledgerRepository;
    private final CampaignRepository campaignRepository;

    public List<LedgerDTO.LedgerResponse> getAll() {
        return ledgerRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<LedgerDTO.LedgerResponse> getByCampaign(Long campaignId) {
        return ledgerRepository.findByCampaignId(campaignId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public LedgerDTO.LedgerResponse create(LedgerDTO.CreateLedgerRequest req) {
        Campaign campaign = req.getCampaignId() != null
                ? campaignRepository.findById(req.getCampaignId()).orElse(null) : null;
        Ledger l = Ledger.builder()
                .campaign(campaign)
                .type(Ledger.LedgerType.valueOf(req.getType().toUpperCase()))
                .amount(req.getAmount()).description(req.getDescription())
                .referenceType(req.getReferenceType()).referenceId(req.getReferenceId()).build();
        return toResponse(ledgerRepository.save(l));
    }

    @Transactional
    public void delete(Long id) {
        ledgerRepository.delete(ledgerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger", "id", id)));
    }

    private LedgerDTO.LedgerResponse toResponse(Ledger l) {
        return LedgerDTO.LedgerResponse.builder()
                .id(l.getId())
                .campaignId(l.getCampaign() != null ? l.getCampaign().getId() : null)
                .campaignTitle(l.getCampaign() != null ? l.getCampaign().getTitle() : null)
                .type(l.getType() != null ? l.getType().name() : null)
                .amount(l.getAmount()).description(l.getDescription())
                .referenceType(l.getReferenceType()).referenceId(l.getReferenceId())
                .recordedAt(l.getRecordedAt() != null ? l.getRecordedAt().toString() : null)
                .build();
    }
}
