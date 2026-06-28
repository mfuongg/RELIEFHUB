package com.reliefhub.service;

import com.reliefhub.dto.VolunteerGroupDTO;
import com.reliefhub.entity.VolunteerGroup;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.VolunteerGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VolunteerGroupService {
    private final VolunteerGroupRepository groupRepository;

    public List<VolunteerGroupDTO.GroupResponse> getAll() {
        return groupRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<VolunteerGroupDTO.GroupResponse> getActive() {
        return groupRepository.findByStatus(VolunteerGroup.GroupStatus.ACTIVE).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public VolunteerGroupDTO.GroupResponse getById(Long id) {
        return toResponse(groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerGroup", "id", id)));
    }

    @Transactional
    public VolunteerGroupDTO.GroupResponse create(VolunteerGroupDTO.CreateGroupRequest req) {
        VolunteerGroup g = VolunteerGroup.builder()
                .name(req.getName())
                .area(req.getArea())
                .description(req.getDescription())
                .status(req.getStatus() != null ? VolunteerGroup.GroupStatus.valueOf(req.getStatus().toUpperCase())
                        : VolunteerGroup.GroupStatus.ACTIVE)
                .build();
        return toResponse(groupRepository.save(g));
    }

    @Transactional
    public VolunteerGroupDTO.GroupResponse update(Long id, VolunteerGroupDTO.UpdateGroupRequest req) {
        VolunteerGroup g = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerGroup", "id", id));
        if (req.getName() != null) g.setName(req.getName());
        if (req.getArea() != null) g.setArea(req.getArea());
        if (req.getDescription() != null) g.setDescription(req.getDescription());
        if (req.getStatus() != null) g.setStatus(VolunteerGroup.GroupStatus.valueOf(req.getStatus().toUpperCase()));
        return toResponse(groupRepository.save(g));
    }

    @Transactional
    public void delete(Long id) {
        groupRepository.delete(groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerGroup", "id", id)));
    }

    private VolunteerGroupDTO.GroupResponse toResponse(VolunteerGroup g) {
        return VolunteerGroupDTO.GroupResponse.builder()
                .id(g.getId()).name(g.getName())
                .leaderName(g.getLeader() != null ? g.getLeader().getFullName() : null)
                .area(g.getArea()).description(g.getDescription())
                .status(g.getStatus() != null ? g.getStatus().name() : "ACTIVE")
                .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : null)
                .build();
    }
}
