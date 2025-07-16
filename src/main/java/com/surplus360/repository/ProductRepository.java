package com.surplus360.repository;

import com.surplus360.domain.Product;
import com.surplus360.domain.enums.ProductCategory;
import com.surplus360.domain.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("select p from Product p where p.owner.id = :ownerId")
    Page<Product> findAllByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("select p from Product p where p.company.id = :companyId")
    Page<Product> findAllByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("select p from Product p where p.status = :status")
    Page<Product> findAllByStatus(@Param("status") ProductStatus status, Pageable pageable);

    @Query("select p from Product p where p.category = :category")
    Page<Product> findAllByCategory(@Param("category") ProductCategory category, Pageable pageable);

    @Query("select p from Product p where p.status = :status and p.category = :category")
    Page<Product> findAllByStatusAndCategory(@Param("status") ProductStatus status, @Param("category") ProductCategory category, Pageable pageable);

    @Query("select p from Product p where p.location like %:location%")
    Page<Product> findAllByLocationContaining(@Param("location") String location, Pageable pageable);

    @Query("select p from Product p where p.salePrice between :minPrice and :maxPrice")
    Page<Product> findAllBySalePriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    @Query("select p from Product p where p.expirationDate >= :currentDate")
    Page<Product> findAllByExpirationDateAfter(@Param("currentDate") LocalDate currentDate, Pageable pageable);

    @Query("select p from Product p where p.expirationDate <= :expirationDate")
    List<Product> findAllByExpirationDateBefore(@Param("expirationDate") LocalDate expirationDate);

    @Query("select p from Product p where p.title like %:searchTerm% or p.description like %:searchTerm% or p.tags like %:searchTerm%")
    Page<Product> findAllBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("select p from Product p where p.status = 'AVAILABLE' and " +
           "(:category is null or p.category = :category) and " +
           "(:location is null or p.location like %:location%) and " +
           "(:minPrice is null or p.salePrice >= :minPrice) and " +
           "(:maxPrice is null or p.salePrice <= :maxPrice)")
    Page<Product> findAvailableProductsWithFilters(
        @Param("category") ProductCategory category,
        @Param("location") String location,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    @Query("select p from Product p where p.status = 'AVAILABLE' order by p.createdAt desc")
    Page<Product> findLatestAvailableProducts(Pageable pageable);

    @Query("select p from Product p where p.status = 'AVAILABLE' order by p.views desc")
    Page<Product> findMostViewedProducts(Pageable pageable);

    @Query("select p from Product p where p.status = 'AVAILABLE' and p.company.verified = true order by p.createdAt desc")
    Page<Product> findLatestFromVerifiedCompanies(Pageable pageable);

    @Query("select count(p) from Product p where p.status = :status")
    long countByStatus(@Param("status") ProductStatus status);

    @Query("select count(p) from Product p where p.category = :category")
    long countByCategory(@Param("category") ProductCategory category);

    @Query("select count(p) from Product p where p.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") Long ownerId);

    @Query("select count(p) from Product p where p.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    Optional<Product> findByIdAndOwnerId(Long id, Long ownerId);

    @Query("select p from Product p where p.id = :id and (p.status = 'AVAILABLE' or p.owner.id = :userId)")
    Optional<Product> findByIdAndVisibleToUser(@Param("id") Long id, @Param("userId") Long userId);
}