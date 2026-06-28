package com.reliefhub.repository;

import com.reliefhub.entity.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DisasterRepository extends JpaRepository<Disaster, Long> {
    List<Disaster> findByStatus(Disaster.DisasterStatus status);
    List<Disaster> findByAreaContainingIgnoreCase(String area);
}
