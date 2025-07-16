package com.surplus360.repository;

import com.surplus360.domain.Notification;
import com.surplus360.domain.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("select n from Notification n where n.userId = :userId order by n.createdAt desc")
    Page<Notification> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") String userId, Pageable pageable);

    @Query("select n from Notification n where n.userId = :userId and n.read = false order by n.createdAt desc")
    Page<Notification> findAllByUserIdAndReadIsFalse(@Param("userId") String userId, Pageable pageable);

    @Query("select n from Notification n where n.userId = :userId and n.read = true order by n.createdAt desc")
    Page<Notification> findAllByUserIdAndReadIsTrue(@Param("userId") String userId, Pageable pageable);

    @Query("select n from Notification n where n.userId = :userId and n.type = :type order by n.createdAt desc")
    Page<Notification> findAllByUserIdAndType(@Param("userId") String userId, @Param("type") NotificationType type, Pageable pageable);

    @Query("select n from Notification n where n.userId = :userId and n.priority = :priority order by n.createdAt desc")
    Page<Notification> findAllByUserIdAndPriority(@Param("userId") String userId, @Param("priority") String priority, Pageable pageable);

    @Query("select n from Notification n where n.userId = :userId and n.read = false and n.priority = 'HIGH' order by n.createdAt desc")
    List<Notification> findHighPriorityUnreadByUserId(@Param("userId") String userId);

    @Query("select count(n) from Notification n where n.userId = :userId and n.read = false")
    long countByUserIdAndReadIsFalse(@Param("userId") String userId);

    @Query("select count(n) from Notification n where n.userId = :userId and n.read = false and n.priority = 'HIGH'")
    long countHighPriorityUnreadByUserId(@Param("userId") String userId);

    @Query("select count(n) from Notification n where n.userId = :userId and n.type = :type")
    long countByUserIdAndType(@Param("userId") String userId, @Param("type") NotificationType type);

    @Query("select n from Notification n where n.createdAt < :expirationDate")
    List<Notification> findAllByCreatedAtBefore(@Param("expirationDate") Instant expirationDate);

    @Query("select n from Notification n where n.userId = :userId and n.read = true and n.createdAt < :expirationDate")
    List<Notification> findAllByUserIdAndReadIsTrueAndCreatedAtBefore(@Param("userId") String userId, @Param("expirationDate") Instant expirationDate);

    @Modifying
    @Transactional
    @Query("update Notification n set n.read = true, n.readAt = :readAt where n.id = :id and n.userId = :userId")
    void markAsRead(@Param("id") Long id, @Param("userId") String userId, @Param("readAt") Instant readAt);

    @Modifying
    @Transactional
    @Query("update Notification n set n.read = true, n.readAt = :readAt where n.userId = :userId and n.read = false")
    void markAllAsRead(@Param("userId") String userId, @Param("readAt") Instant readAt);

    @Modifying
    @Transactional
    @Query("delete from Notification n where n.userId = :userId and n.read = true and n.createdAt < :expirationDate")
    void deleteAllByUserIdAndReadIsTrueAndCreatedAtBefore(@Param("userId") String userId, @Param("expirationDate") Instant expirationDate);

    @Modifying
    @Transactional
    @Query("delete from Notification n where n.createdAt < :expirationDate")
    void deleteAllByCreatedAtBefore(@Param("expirationDate") Instant expirationDate);

    // Statistics queries
    @Query("select count(n) from Notification n where n.type = :type")
    long countByType(@Param("type") NotificationType type);

    @Query("select count(n) from Notification n where n.createdAt >= :startDate and n.createdAt <= :endDate")
    long countByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select count(n) from Notification n where n.priority = 'HIGH' and n.createdAt >= :startDate and n.createdAt <= :endDate")
    long countHighPriorityByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select n.type, count(n) from Notification n group by n.type")
    List<Object[]> countByTypeGrouped();

    @Query("select n.priority, count(n) from Notification n group by n.priority")
    List<Object[]> countByPriorityGrouped();
}