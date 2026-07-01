package com.reliefhub.service;

import com.reliefhub.dto.DeliveryDTO;
import com.reliefhub.entity.*;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final SupportRequestRepository requestRepository;

    public List<DeliveryDTO.DeliveryResponse> getAll() {
        return deliveryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DeliveryDTO.DeliveryResponse> getByStatus(String status) {
        return deliveryRepository.findByStatus(Delivery.DeliveryStatus.valueOf(status.toUpperCase()))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DeliveryDTO.DeliveryResponse create(DeliveryDTO.CreateDeliveryRequest req) {
        Delivery d = Delivery.builder()
                .deliveryCode("DLV-" + System.currentTimeMillis())
                .request(req.getRequestId() != null
                        ? requestRepository.findById(req.getRequestId()).orElse(null) : null)
                .campaign(req.getCampaignId() != null
                        ? campaignRepository.findById(req.getCampaignId()).orElse(null) : null)
                .driver(req.getDriverId() != null
                        ? userRepository.findById(req.getDriverId()).orElse(null) : null)
                .vehicleType(req.getVehicleType())
                .licensePlate(req.getLicensePlate())
                .origin(req.getOrigin())
                .destination(req.getDestination())
                .departAt(req.getDepartAt() != null ? LocalDateTime.parse(req.getDepartAt()) : null)
                .status(req.getStatus() != null
                        ? Delivery.DeliveryStatus.valueOf(req.getStatus().toUpperCase())
                        : Delivery.DeliveryStatus.SCHEDULED)
                .note(req.getNote())
                .build();
        return toResponse(deliveryRepository.save(d));
    }

    @Transactional
    public DeliveryDTO.DeliveryResponse updateStatus(Long id, DeliveryDTO.UpdateDeliveryStatusRequest req) {
        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", id));
        d.setStatus(Delivery.DeliveryStatus.valueOf(req.getStatus().toUpperCase()));
        if (req.getNote() != null) d.setNote(req.getNote());
        if ("DELIVERED".equalsIgnoreCase(req.getStatus())) d.setArriveAt(LocalDateTime.now());
        return toResponse(deliveryRepository.save(d));
    }

    @Transactional
    public void delete(Long id) {
        deliveryRepository.delete(deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", id)));
    }

    private DeliveryDTO.DeliveryResponse toResponse(Delivery d) {
        return DeliveryDTO.DeliveryResponse.builder()
                .id(d.getId())
                .deliveryCode(d.getDeliveryCode())
                .requestId(d.getRequest() != null ? d.getRequest().getId() : null)
                .campaignId(d.getCampaign() != null ? d.getCampaign().getId() : null)
                .campaignTitle(d.getCampaign() != null ? d.getCampaign().getTitle() : null)
                .driverId(d.getDriver() != null ? d.getDriver().getId() : null)
                .driverName(d.getDriver() != null ? d.getDriver().getFullName() : null)
                .vehicleType(d.getVehicleType())
                .licensePlate(d.getLicensePlate())
                .origin(d.getOrigin())
                .destination(d.getDestination())
                .departAt(d.getDepartAt() != null ? d.getDepartAt().toString() : null)
                .arriveAt(d.getArriveAt() != null ? d.getArriveAt().toString() : null)
                .status(d.getStatus() != null ? d.getStatus().name() : "SCHEDULED")
                .note(d.getNote())
                .build();
    }
}
