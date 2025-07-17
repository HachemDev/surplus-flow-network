package com.surplus.repository;

import com.surplus.domain.UserProfile;
import com.surplus.domain.enumeration.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(Long userId);

    Optional<UserProfile> findByEmail(String email);

    List<UserProfile> findByRole(UserRole role);

    List<UserProfile> findByCompanyId(Long companyId);

    @Query("SELECT up FROM UserProfile up WHERE up.user.login = :login")
    Optional<UserProfile> findByUserLogin(@Param("login") String login);

    @Query("SELECT up FROM UserProfile up WHERE up.isVerified = :verified")
    List<UserProfile> findByVerified(@Param("verified") Boolean verified);
}