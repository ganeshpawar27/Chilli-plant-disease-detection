package com.uday.chillidisease.repository;

import com.uday.chillidisease.entity.Farmer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    Optional<Farmer> findByEmail(String email);

    Optional<Farmer> findByPhone(String phone);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    Page<Farmer> findAll(Pageable pageable);

    long count();
}