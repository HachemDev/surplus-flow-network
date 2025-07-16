package com.surplus360.repository;

import com.surplus360.domain.Transaction;
import com.surplus360.domain.enums.TransactionStatus;
import com.surplus360.domain.enums.TransactionType;
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
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("select t from Transaction t where t.buyer.id = :buyerId")
    Page<Transaction> findAllByBuyerId(@Param("buyerId") Long buyerId, Pageable pageable);

    @Query("select t from Transaction t where t.seller.id = :sellerId")
    Page<Transaction> findAllBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    @Query("select t from Transaction t where t.buyer.id = :userId or t.seller.id = :userId")
    Page<Transaction> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("select t from Transaction t where t.status = :status")
    Page<Transaction> findAllByStatus(@Param("status") TransactionStatus status, Pageable pageable);

    @Query("select t from Transaction t where t.type = :type")
    Page<Transaction> findAllByType(@Param("type") TransactionType type, Pageable pageable);

    @Query("select t from Transaction t where t.product.id = :productId")
    Page<Transaction> findAllByProductId(@Param("productId") Long productId, Pageable pageable);

    @Query("select t from Transaction t where t.status = :status and t.createdAt < :dateTime")
    List<Transaction> findAllByStatusAndCreatedAtBefore(@Param("status") TransactionStatus status, @Param("dateTime") Instant dateTime);

    @Query("select t from Transaction t where t.status = :status and t.type = :type")
    Page<Transaction> findAllByStatusAndType(@Param("status") TransactionStatus status, @Param("type") TransactionType type, Pageable pageable);

    @Query("select t from Transaction t where t.price between :minPrice and :maxPrice")
    Page<Transaction> findAllByPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    @Query("select t from Transaction t where t.acceptedAt is not null and t.acceptedAt >= :startDate and t.acceptedAt <= :endDate")
    List<Transaction> findAllByAcceptedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select t from Transaction t where t.completedAt is not null and t.completedAt >= :startDate and t.completedAt <= :endDate")
    List<Transaction> findAllByCompletedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select t from Transaction t where t.product.company.id = :companyId")
    Page<Transaction> findAllByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("select t from Transaction t where " +
           "(:buyerId is null or t.buyer.id = :buyerId) and " +
           "(:sellerId is null or t.seller.id = :sellerId) and " +
           "(:status is null or t.status = :status) and " +
           "(:type is null or t.type = :type) and " +
           "(:minPrice is null or t.price >= :minPrice) and " +
           "(:maxPrice is null or t.price <= :maxPrice)")
    Page<Transaction> findAllWithFilters(
        @Param("buyerId") Long buyerId,
        @Param("sellerId") Long sellerId,
        @Param("status") TransactionStatus status,
        @Param("type") TransactionType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    @Query("select t from Transaction t where t.status = 'PENDING' and t.createdAt < :expirationTime")
    List<Transaction> findPendingTransactionsOlderThan(@Param("expirationTime") Instant expirationTime);

    @Query("select t from Transaction t where t.status = 'ACCEPTED' and t.acceptedAt < :expirationTime")
    List<Transaction> findAcceptedTransactionsOlderThan(@Param("expirationTime") Instant expirationTime);

    @Query("select t from Transaction t where t.id = :id and (t.buyer.id = :userId or t.seller.id = :userId)")
    Optional<Transaction> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    // Statistics queries
    @Query("select count(t) from Transaction t where t.status = :status")
    long countByStatus(@Param("status") TransactionStatus status);

    @Query("select count(t) from Transaction t where t.type = :type")
    long countByType(@Param("type") TransactionType type);

    @Query("select count(t) from Transaction t where t.buyer.id = :buyerId")
    long countByBuyerId(@Param("buyerId") Long buyerId);

    @Query("select count(t) from Transaction t where t.seller.id = :sellerId")
    long countBySellerId(@Param("sellerId") Long sellerId);

    @Query("select count(t) from Transaction t where t.product.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("select sum(t.price) from Transaction t where t.status = 'COMPLETED' and t.type = :type")
    BigDecimal sumCompletedTransactionsByType(@Param("type") TransactionType type);

    @Query("select sum(t.price) from Transaction t where t.status = 'COMPLETED' and t.product.company.id = :companyId")
    BigDecimal sumCompletedTransactionsByCompany(@Param("companyId") Long companyId);

    @Query("select sum(t.quantity) from Transaction t where t.status = 'COMPLETED' and t.type = :type")
    Long sumCompletedQuantityByType(@Param("type") TransactionType type);

    @Query("select avg(t.price) from Transaction t where t.status = 'COMPLETED'")
    Double averageCompletedTransactionPrice();

    @Query("select count(t) from Transaction t where t.createdAt >= :startDate and t.createdAt <= :endDate")
    long countByCreatedAtBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("select count(t) from Transaction t where t.status = 'COMPLETED' and t.completedAt >= :startDate and t.completedAt <= :endDate")
    long countCompletedTransactionsBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}