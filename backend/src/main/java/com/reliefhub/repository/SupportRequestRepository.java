package com.reliefhub.repository;

import com.reliefhub.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    List<SupportRequest> findByCitizenId(Long citizenId);
    List<SupportRequest> findByStatus(SupportRequest.RequestStatus status);
    List<SupportRequest> findByAreaContainingIgnoreCase(String area);
}
