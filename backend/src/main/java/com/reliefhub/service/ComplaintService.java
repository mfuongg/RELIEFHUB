package com.reliefhub.service;

import com.reliefhub.dto.ComplaintDTO;
import com.reliefhub.entity.Complaint;
import com.reliefhub.entity.User;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.ComplaintRepository;
import com.reliefhub.repository.UserRepository;
import com.reliefhub.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public List<ComplaintDTO.ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO.ComplaintResponse> getMyComplaints() {
        CustomUserDetails userDetails = getCurrentUser();
        return complaintRepository.findBySenderId(userDetails.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintDTO.ComplaintResponse createComplaint(ComplaintDTO.CreateComplaintRequest request) {
        CustomUserDetails userDetails = getCurrentUser();
        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        Complaint complaint = Complaint.builder()
                .complaintCode("CMP-" + System.currentTimeMillis())
                .sender(sender)
                .senderName(sender.getFullName())
                .senderRole(userDetails.getRole())
                .type(request.getType())
                .subject(request.getSubject())
                .content(request.getContent())
                .contactInfo(request.getContactInfo())
                .status(Complaint.ComplaintStatus.PENDING)
                .progress(0)
                .build();

        complaint = complaintRepository.save(complaint);
        return toResponse(complaint);
    }

    @Transactional
    public ComplaintDTO.ComplaintResponse replyComplaint(Long id, ComplaintDTO.ReplyComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        complaint.setAdminReply(request.getAdminReply());
        complaint.setStatus(Complaint.ComplaintStatus.REPLIED);
        complaint.setRepliedAt(LocalDateTime.now());
        complaint.setProgress(100);

        complaint = complaintRepository.save(complaint);
        return toResponse(complaint);
    }

    @Transactional
    public ComplaintDTO.ComplaintResponse closeComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
        complaint.setStatus(Complaint.ComplaintStatus.CLOSED);
        complaint = complaintRepository.save(complaint);
        return toResponse(complaint);
    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private ComplaintDTO.ComplaintResponse toResponse(Complaint c) {
        return ComplaintDTO.ComplaintResponse.builder()
                .id(c.getId())
                .complaintCode(c.getComplaintCode())
                .senderName(c.getSenderName())
                .senderRole(c.getSenderRole())
                .type(c.getType())
                .subject(c.getSubject())
                .content(c.getContent())
                .contactInfo(c.getContactInfo())
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .adminReply(c.getAdminReply())
                .progress(c.getProgress() != null ? c.getProgress() : 0)
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null)
                .repliedAt(c.getRepliedAt() != null ? c.getRepliedAt().toString() : null)
                .build();
    }
}
