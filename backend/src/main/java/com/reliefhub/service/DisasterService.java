package com.reliefhub.service;

import com.reliefhub.dto.DisasterDTO;
import com.reliefhub.entity.Disaster;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.DisasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisasterService {

    private final DisasterRepository disasterRepository;

    public List<DisasterDTO.DisasterResponse> getAllDisasters() {
        return disasterRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DisasterDTO.DisasterResponse> getActiveDisasters() {
        return disasterRepository.findByStatus(Disaster.DisasterStatus.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DisasterDTO.DisasterResponse getDisasterById(Long id) {
        Disaster d = disasterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disaster", "id", id));
        return toResponse(d);
    }

    @Transactional
    public DisasterDTO.DisasterResponse createDisaster(DisasterDTO.CreateDisasterRequest request) {
        Disaster disaster = Disaster.builder()
                .name(request.getName())
                .type(request.getType())
                .area(request.getArea())
                .severity(request.getSeverity() != null
                        ? Disaster.Severity.valueOf(request.getSeverity().toUpperCase())
                        : Disaster.Severity.MEDIUM)
                .description(request.getDescription())
                .occurredAt(request.getOccurredAt() != null ? LocalDate.parse(request.getOccurredAt()) : null)
                .status(request.getStatus() != null
                        ? Disaster.DisasterStatus.valueOf(request.getStatus().toUpperCase())
                        : Disaster.DisasterStatus.ACTIVE)
                .build();

        disaster = disasterRepository.save(disaster);
        return toResponse(disaster);
    }

    @Transactional
    public DisasterDTO.DisasterResponse updateDisaster(Long id, DisasterDTO.UpdateDisasterRequest request) {
        Disaster disaster = disasterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disaster", "id", id));

        if (request.getName() != null) disaster.setName(request.getName());
        if (request.getType() != null) disaster.setType(request.getType());
        if (request.getArea() != null) disaster.setArea(request.getArea());
        if (request.getSeverity() != null)
            disaster.setSeverity(Disaster.Severity.valueOf(request.getSeverity().toUpperCase()));
        if (request.getDescription() != null) disaster.setDescription(request.getDescription());
        if (request.getOccurredAt() != null)
            disaster.setOccurredAt(LocalDate.parse(request.getOccurredAt()));
        if (request.getStatus() != null)
            disaster.setStatus(Disaster.DisasterStatus.valueOf(request.getStatus().toUpperCase()));

        disaster = disasterRepository.save(disaster);
        return toResponse(disaster);
    }

    @Transactional
    public void deleteDisaster(Long id) {
        Disaster disaster = disasterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disaster", "id", id));
        disasterRepository.delete(disaster);
    }

    private DisasterDTO.DisasterResponse toResponse(Disaster d) {
        return DisasterDTO.DisasterResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .type(d.getType())
                .area(d.getArea())
                .severity(d.getSeverity() != null ? d.getSeverity().name() : "MEDIUM")
                .description(d.getDescription())
                .occurredAt(d.getOccurredAt() != null ? d.getOccurredAt().toString() : null)
                .status(d.getStatus() != null ? d.getStatus().name() : "ACTIVE")
                .createdAt(d.getCreatedAt() != null ? d.getCreatedAt().toString() : null)
                .build();
    }
}
