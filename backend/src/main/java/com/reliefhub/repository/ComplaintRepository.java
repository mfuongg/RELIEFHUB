package com.reliefhub.repository;

import com.reliefhub.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySenderId(Long senderId);
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
}
