package com.surplus360.repository;

import com.surplus360.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedAtBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Query("select u from User u where u.login = :login")
    Optional<User> findOneWithAuthoritiesByLogin(@Param("login") String login);

    @EntityGraph(attributePaths = "authorities")
    @Query("select u from User u where u.email = :email")
    Optional<User> findOneWithAuthoritiesByEmail(@Param("email") String email);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesById(Long id);

    @Query("select u from User u where u.activated = false and u.createdAt < :dateTime")
    Page<User> findAllByActivatedIsFalseAndCreatedAtBefore(Instant dateTime, Pageable pageable);

    @Query("select u from User u where u.activated = true")
    Page<User> findAllByActivatedIsTrue(Pageable pageable);

    @Query("select u from User u where u.login <> :login")
    Page<User> findAllByLoginNot(@Param("login") String login, Pageable pageable);

    @Query("select u from User u where u.lastLogin < :dateTime")
    List<User> findAllByLastLoginBefore(Instant dateTime);

    @Query("select count(u) from User u where u.activated = true")
    long countByActivatedIsTrue();

    @Query("select count(u) from User u where u.activated = false")
    long countByActivatedIsFalse();

    @Query("select count(u) from User u where u.createdAt >= :startDate and u.createdAt <= :endDate")
    long countByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    boolean existsByLogin(String login);

    boolean existsByEmail(String email);
}