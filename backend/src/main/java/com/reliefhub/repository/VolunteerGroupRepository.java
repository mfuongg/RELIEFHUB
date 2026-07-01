package com.reliefhub.repository;

import com.reliefhub.entity.VolunteerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VolunteerGroupRepository extends JpaRepository<VolunteerGroup, Long> {
    List<VolunteerGroup> findByStatus(VolunteerGroup.GroupStatus status);
    List<VolunteerGroup> findByAreaContainingIgnoreCase(String area);
}
