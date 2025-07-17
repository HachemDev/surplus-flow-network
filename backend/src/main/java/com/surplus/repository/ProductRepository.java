package com.surplus.repository;

import com.surplus.domain.Product;
import com.surplus.domain.enumeration.ProductCategory;
import com.surplus.domain.enumeration.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByOwnerId(Long ownerId);

    Page<Product> findByOwnerId(Long ownerId, Pageable pageable);

    List<Product> findByCompanyId(Long companyId);

    Page<Product> findByCompanyId(Long companyId, Pageable pageable);

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByStatus(ProductStatus status);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.expirationDate > :now")
    List<Product> findAvailableProducts(@Param("now") LocalDateTime now);

    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.expirationDate > :now")
    Page<Product> findAvailableProducts(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword% OR p.tags LIKE %:keyword%")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.status = 'AVAILABLE'")
    Page<Product> findAvailableProductsByCategory(@Param("category") ProductCategory category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.location LIKE %:location% AND p.status = 'AVAILABLE'")
    Page<Product> findAvailableProductsByLocation(@Param("location") String location, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.salePrice BETWEEN :minPrice AND :maxPrice AND p.status = 'AVAILABLE'")
    Page<Product> findAvailableProductsByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);
}