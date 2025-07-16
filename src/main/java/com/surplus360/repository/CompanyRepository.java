package com.surplus360.repository;

import com.surplus360.domain.Company;
import com.surplus360.domain.enums.CompanyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("select c from Company c where c.verified = true")
    Page<Company> findAllByVerifiedIsTrue(Pageable pageable);

    @Query("select c from Company c where c.type = :type")
    Page<Company> findAllByType(@Param("type") CompanyType type, Pageable pageable);

    @Query("select c from Company c where c.location like %:location%")
    Page<Company> findAllByLocationContaining(@Param("location") String location, Pageable pageable);

    @Query("select c from Company c where lower(c.name) like lower(concat('%', :name, '%'))")
    Page<Company> findAllByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    @Query("select c from Company c where c.email = :email")
    Optional<Company> findByEmail(@Param("email") String email);

    @Query("select c from Company c where c.industry = :industry")
    Page<Company> findAllByIndustry(@Param("industry") String industry, Pageable pageable);

    @Query("select c from Company c where c.rseScore >= :minScore")
    Page<Company> findAllByRseScoreGreaterThanEqual(@Param("minScore") Integer minScore, Pageable pageable);

    @Query("select c from Company c where c.verified = true and c.type = :type")
    Page<Company> findAllByVerifiedAndType(@Param("type") CompanyType type, Pageable pageable);

    @Query("select c from Company c where c.verified = true and c.location like %:location%")
    Page<Company> findAllByVerifiedAndLocationContaining(@Param("location") String location, Pageable pageable);

    @Query("select c from Company c where " +
           "(:name is null or lower(c.name) like lower(concat('%', :name, '%'))) and " +
           "(:type is null or c.type = :type) and " +
           "(:industry is null or c.industry = :industry) and " +
           "(:location is null or c.location like %:location%) and " +
           "(:verified is null or c.verified = :verified) and " +
           "(:minRseScore is null or c.rseScore >= :minRseScore)")
    Page<Company> findAllWithFilters(
        @Param("name") String name,
        @Param("type") CompanyType type,
        @Param("industry") String industry,
        @Param("location") String location,
        @Param("verified") Boolean verified,
        @Param("minRseScore") Integer minRseScore,
        Pageable pageable
    );

    @Query("select c from Company c order by c.rseScore desc")
    Page<Company> findTopByRseScore(Pageable pageable);

    @Query("select c from Company c where c.verified = true order by c.totalSurplus desc")
    Page<Company> findTopSurplusProviders(Pageable pageable);

    @Query("select c from Company c where c.verified = true order by c.totalDonations desc")
    Page<Company> findTopDonors(Pageable pageable);

    @Query("select c from Company c where c.co2Saved >= :minCo2Saved")
    List<Company> findAllByCo2SavedGreaterThanEqual(@Param("minCo2Saved") BigDecimal minCo2Saved);

    @Query("select c from Company c where c.wasteReduced >= :minWasteReduced")
    List<Company> findAllByWasteReducedGreaterThanEqual(@Param("minWasteReduced") BigDecimal minWasteReduced);

    @Query("select c from Company c where c.createdAt >= :startDate and c.createdAt <= :endDate")
    List<Company> findAllByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select count(c) from Company c where c.verified = true")
    long countByVerifiedIsTrue();

    @Query("select count(c) from Company c where c.type = :type")
    long countByType(@Param("type") CompanyType type);

    @Query("select count(c) from Company c where c.verified = true and c.type = :type")
    long countByVerifiedAndType(@Param("type") CompanyType type);

    @Query("select sum(c.totalSurplus) from Company c")
    Long sumTotalSurplus();

    @Query("select sum(c.co2Saved) from Company c")
    BigDecimal sumCo2Saved();

    @Query("select sum(c.wasteReduced) from Company c")
    BigDecimal sumWasteReduced();

    @Query("select avg(c.rseScore) from Company c where c.rseScore > 0")
    Double averageRseScore();

    boolean existsByEmail(String email);

    boolean existsByName(String name);
}