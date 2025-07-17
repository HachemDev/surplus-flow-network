package com.surplus.repository;

import com.surplus.domain.Transaction;
import com.surplus.domain.enumeration.TransactionStatus;
import com.surplus.domain.enumeration.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByBuyerId(Long buyerId);

    Page<Transaction> findByBuyerId(Long buyerId, Pageable pageable);

    List<Transaction> findBySellerId(Long sellerId);

    Page<Transaction> findBySellerId(Long sellerId, Pageable pageable);

    List<Transaction> findByProductId(Long productId);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByType(TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.buyer.id = :userId OR t.seller.id = :userId")
    List<Transaction> findByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.buyer.id = :userId OR t.seller.id = :userId")
    Page<Transaction> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.product.company.id = :companyId")
    List<Transaction> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT t FROM Transaction t WHERE t.product.company.id = :companyId")
    Page<Transaction> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);
}