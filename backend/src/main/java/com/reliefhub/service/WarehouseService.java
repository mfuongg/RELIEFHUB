package com.reliefhub.service;

import com.reliefhub.dto.WarehouseDTO;
import com.reliefhub.entity.Warehouse;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public List<WarehouseDTO.WarehouseResponse> getAll() {
        return warehouseRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public WarehouseDTO.WarehouseResponse create(WarehouseDTO.CreateWarehouseRequest req) {
        Warehouse w = Warehouse.builder()
                .name(req.getName()).address(req.getAddress())
                .province(req.getProvince())
                .status(req.getStatus() != null ? req.getStatus() : "ACTIVE").build();
        return toResponse(warehouseRepository.save(w));
    }

    @Transactional
    public void delete(Integer id) {
        warehouseRepository.delete(warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id)));
    }

    private WarehouseDTO.WarehouseResponse toResponse(Warehouse w) {
        return WarehouseDTO.WarehouseResponse.builder()
                .id(w.getId() != null ? w.getId().longValue() : null)
                .name(w.getName()).address(w.getAddress())
                .province(w.getProvince()).status(w.getStatus()).build();
    }
}
