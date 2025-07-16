package com.surplus360.repository;

import com.surplus360.domain.Logistics;
import com.surplus360.domain.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface LogisticsRepository extends JpaRepository<Logistics, Long> {

    @Query("select l from Logistics l where l.transaction.id = :transactionId")
    Optional<Logistics> findByTransactionId(@Param("transactionId") Long transactionId);

    @Query("select l from Logistics l where l.status = :status")
    Page<Logistics> findAllByStatus(@Param("status") TransactionStatus status, Pageable pageable);

    @Query("select l from Logistics l where l.carrierName = :carrierName")
    List<Logistics> findAllByCarrierName(@Param("carrierName") String carrierName);

    @Query("select l from Logistics l where l.trackingNumber = :trackingNumber")
    Optional<Logistics> findByTrackingNumber(@Param("trackingNumber") String trackingNumber);

    @Query("select l from Logistics l where l.pickupDate >= :startDate and l.pickupDate <= :endDate")
    List<Logistics> findAllByPickupDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select l from Logistics l where l.estimatedDelivery >= :startDate and l.estimatedDelivery <= :endDate")
    List<Logistics> findAllByEstimatedDeliveryBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select l from Logistics l where l.actualDelivery >= :startDate and l.actualDelivery <= :endDate")
    List<Logistics> findAllByActualDeliveryBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select l from Logistics l where l.status = 'IN_TRANSIT' and l.estimatedDelivery < :currentTime")
    List<Logistics> findOverdueDeliveries(@Param("currentTime") Instant currentTime);

    @Query("select l from Logistics l where l.status = 'PENDING' and l.pickupDate < :currentTime")
    List<Logistics> findOverduePickups(@Param("currentTime") Instant currentTime);

    @Query("select l from Logistics l where l.contactPerson = :contactPerson")
    List<Logistics> findAllByContactPerson(@Param("contactPerson") String contactPerson);

    @Query("select l from Logistics l where l.contactPhone = :contactPhone")
    List<Logistics> findAllByContactPhone(@Param("contactPhone") String contactPhone);

    @Query("select l from Logistics l where " +
           "(:carrierName is null or l.carrierName = :carrierName) and " +
           "(:status is null or l.status = :status) and " +
           "(:contactPerson is null or l.contactPerson = :contactPerson)")
    Page<Logistics> findAllWithFilters(
        @Param("carrierName") String carrierName,
        @Param("status") TransactionStatus status,
        @Param("contactPerson") String contactPerson,
        Pageable pageable
    );

    @Query("select l from Logistics l where l.pickupAddress like %:address%")
    List<Logistics> findAllByPickupAddressContaining(@Param("address") String address);

    @Query("select l from Logistics l where l.deliveryAddress like %:address%")
    List<Logistics> findAllByDeliveryAddressContaining(@Param("address") String address);

    @Query("select l from Logistics l where l.actualDelivery is null and l.estimatedDelivery < :currentTime")
    List<Logistics> findPendingDeliveriesPastDue(@Param("currentTime") Instant currentTime);

    @Query("select l from Logistics l where l.actualDelivery is not null order by l.actualDelivery desc")
    Page<Logistics> findCompletedDeliveriesOrderByActualDeliveryDesc(Pageable pageable);

    // Statistics queries
    @Query("select count(l) from Logistics l where l.status = :status")
    long countByStatus(@Param("status") TransactionStatus status);

    @Query("select count(l) from Logistics l where l.carrierName = :carrierName")
    long countByCarrierName(@Param("carrierName") String carrierName);

    @Query("select count(l) from Logistics l where l.actualDelivery is not null")
    long countCompletedDeliveries();

    @Query("select count(l) from Logistics l where l.actualDelivery is null and l.estimatedDelivery < :currentTime")
    long countOverdueDeliveries(@Param("currentTime") Instant currentTime);

    @Query("select l.carrierName, count(l) from Logistics l group by l.carrierName order by count(l) desc")
    List<Object[]> countByCarrierNameGrouped();

    @Query("select l.status, count(l) from Logistics l group by l.status")
    List<Object[]> countByStatusGrouped();

    @Query("select avg(l.cost) from Logistics l where l.cost > 0")
    Double averageLogisticsCost();

    @Query("select sum(l.cost) from Logistics l where l.cost > 0")
    Double sumLogisticsCost();

    @Query("select count(l) from Logistics l where l.createdAt >= :startDate and l.createdAt <= :endDate")
    long countByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select count(l) from Logistics l where l.actualDelivery >= :startDate and l.actualDelivery <= :endDate")
    long countCompletedDeliveriesBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    boolean existsByTrackingNumber(String trackingNumber);

    boolean existsByTransactionId(Long transactionId);
}