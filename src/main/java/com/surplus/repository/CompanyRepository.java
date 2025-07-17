package com.surplus.repository;

import com.surplus.domain.Company;
import com.surplus.domain.enumeration.CompanyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByName(String name);

    List<Company> findByType(CompanyType type);

    List<Company> findByVerified(Boolean verified);

    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT c FROM Company c WHERE c.city = :city")
    List<Company> findByCity(@Param("city") String city);

    @Query("SELECT c FROM Company c WHERE c.type = :type AND c.verified = true")
    List<Company> findVerifiedCompaniesByType(@Param("type") CompanyType type);

    @Query("SELECT c FROM Company c JOIN c.users u WHERE u.id = :userId")
    Optional<Company> findByUserId(@Param("userId") Long userId);
}