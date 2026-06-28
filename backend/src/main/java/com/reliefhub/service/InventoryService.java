package com.reliefhub.service;

import com.reliefhub.dto.InventoryDTO;
import com.reliefhub.entity.Inventory;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.InventoryRepository;
import com.reliefhub.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;

    public List<InventoryDTO.InventoryResponse> getAll() {
        return inventoryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InventoryDTO.InventoryResponse getById(Long id) {
        return toResponse(inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id)));
    }

    @Transactional
    public InventoryDTO.InventoryResponse create(InventoryDTO.CreateInventoryRequest req) {
        Inventory inv = Inventory.builder()
                .itemName(req.getItemName()).category(req.getCategory())
                .quantity(req.getQuantity()).unit(req.getUnit())
                .minStock(req.getMinStock()).warehouseId(req.getWarehouseId())
                .description(req.getDescription()).build();
        return toResponse(inventoryRepository.save(inv));
    }

    @Transactional
    public InventoryDTO.InventoryResponse update(Long id, InventoryDTO.UpdateInventoryRequest req) {
        Inventory inv = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        if (req.getItemName() != null) inv.setItemName(req.getItemName());
        if (req.getCategory() != null) inv.setCategory(req.getCategory());
        if (req.getQuantity() != null) inv.setQuantity(req.getQuantity());
        if (req.getUnit() != null) inv.setUnit(req.getUnit());
        if (req.getMinStock() != null) inv.setMinStock(req.getMinStock());
        if (req.getWarehouseId() != null) inv.setWarehouseId(req.getWarehouseId());
        if (req.getDescription() != null) inv.setDescription(req.getDescription());
        return toResponse(inventoryRepository.save(inv));
    }

    @Transactional
    public InventoryDTO.InventoryResponse restock(Long id, InventoryDTO.RestockRequest req) {
        Inventory inv = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        inv.setQuantity(inv.getQuantity() + req.getQuantity());
        return toResponse(inventoryRepository.save(inv));
    }

    @Transactional
    public void delete(Long id) {
        inventoryRepository.delete(inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id)));
    }

    private InventoryDTO.InventoryResponse toResponse(Inventory inv) {
        String warehouseName = inv.getWarehouseId() != null
                ? warehouseRepository.findById(inv.getWarehouseId())
                        .map(w -> w.getName()).orElse(null)
                : null;
        return InventoryDTO.InventoryResponse.builder()
                .id(inv.getId()).itemName(inv.getItemName())
                .category(inv.getCategory()).quantity(inv.getQuantity())
                .unit(inv.getUnit()).minStock(inv.getMinStock())
                .warehouseId(inv.getWarehouseId()).warehouseName(warehouseName)
                .description(inv.getDescription()).build();
    }
}
