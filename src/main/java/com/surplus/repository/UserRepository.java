package com.surplus.repository;

import com.surplus.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLogin(String login);

    Optional<User> findByEmail(String email);

    Optional<User> findByLoginOrEmail(String login, String email);

    Optional<User> findByActivationKey(String activationKey);

    Optional<User> findByResetKey(String resetKey);

    boolean existsByLogin(String login);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.activated = false AND u.createdDate < :dateTime")
    Iterable<User> findNotActivatedUsersByCreationDateBefore(@Param("dateTime") LocalDateTime dateTime);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.authorities WHERE u.login = :login")
    Optional<User> findOneWithAuthoritiesByLogin(@Param("login") String login);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.authorities WHERE u.email = :email")
    Optional<User> findOneWithAuthoritiesByEmail(@Param("email") String email);
}