package com.surplus360.repository;

import com.surplus360.domain.UserProfile;
import com.surplus360.domain.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Query("select up from UserProfile up where up.user.id = :userId")
    Optional<UserProfile> findByUserId(@Param("userId") Long userId);

    @Query("select up from UserProfile up where up.role = :role")
    Page<UserProfile> findAllByRole(@Param("role") UserRole role, Pageable pageable);

    @Query("select up from UserProfile up where up.companyId = :companyId")
    Page<UserProfile> findAllByCompanyId(@Param("companyId") String companyId, Pageable pageable);

    @Query("select up from UserProfile up where up.email = :email")
    Optional<UserProfile> findByEmail(@Param("email") String email);

    @Query("select up from UserProfile up where up.isVerified = true")
    Page<UserProfile> findAllByIsVerifiedTrue(Pageable pageable);

    @Query("select up from UserProfile up where up.isVerified = false")
    Page<UserProfile> findAllByIsVerifiedFalse(Pageable pageable);

    @Query("select up from UserProfile up where up.city = :city")
    Page<UserProfile> findAllByCity(@Param("city") String city, Pageable pageable);

    @Query("select up from UserProfile up where up.country = :country")
    Page<UserProfile> findAllByCountry(@Param("country") String country, Pageable pageable);

    @Query("select up from UserProfile up where up.role = :role and up.city = :city")
    Page<UserProfile> findAllByRoleAndCity(@Param("role") UserRole role, @Param("city") String city, Pageable pageable);

    @Query("select up from UserProfile up where up.role = :role and up.isVerified = true")
    Page<UserProfile> findAllByRoleAndIsVerifiedTrue(@Param("role") UserRole role, Pageable pageable);

    @Query("select up from UserProfile up where " +
           "(:role is null or up.role = :role) and " +
           "(:city is null or up.city = :city) and " +
           "(:country is null or up.country = :country) and " +
           "(:isVerified is null or up.isVerified = :isVerified) and " +
           "(:companyId is null or up.companyId = :companyId)")
    Page<UserProfile> findAllWithFilters(
        @Param("role") UserRole role,
        @Param("city") String city,
        @Param("country") String country,
        @Param("isVerified") Boolean isVerified,
        @Param("companyId") String companyId,
        Pageable pageable
    );

    @Query("select up from UserProfile up where " +
           "lower(up.firstName) like lower(concat('%', :name, '%')) or " +
           "lower(up.lastName) like lower(concat('%', :name, '%'))")
    Page<UserProfile> findAllByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("select up from UserProfile up where up.phone = :phone")
    Optional<UserProfile> findByPhone(@Param("phone") String phone);

    // Statistics queries
    @Query("select count(up) from UserProfile up where up.role = :role")
    long countByRole(@Param("role") UserRole role);

    @Query("select count(up) from UserProfile up where up.isVerified = true")
    long countByIsVerifiedTrue();

    @Query("select count(up) from UserProfile up where up.isVerified = false")
    long countByIsVerifiedFalse();

    @Query("select count(up) from UserProfile up where up.city = :city")
    long countByCity(@Param("city") String city);

    @Query("select count(up) from UserProfile up where up.country = :country")
    long countByCountry(@Param("country") String country);

    @Query("select count(up) from UserProfile up where up.companyId = :companyId")
    long countByCompanyId(@Param("companyId") String companyId);

    @Query("select up.role, count(up) from UserProfile up group by up.role")
    List<Object[]> countByRoleGrouped();

    @Query("select up.city, count(up) from UserProfile up where up.city is not null group by up.city order by count(up) desc")
    List<Object[]> countByCityGrouped();

    @Query("select up.country, count(up) from UserProfile up where up.country is not null group by up.country order by count(up) desc")
    List<Object[]> countByCountryGrouped();

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByUserId(Long userId);
}