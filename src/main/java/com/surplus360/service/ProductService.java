package com.surplus360.service;

import com.surplus360.domain.Product;
import com.surplus360.domain.User;
import com.surplus360.domain.enums.ProductStatus;
import com.surplus360.repository.CompanyRepository;
import com.surplus360.repository.ProductRepository;
import com.surplus360.repository.UserRepository;
import com.surplus360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ProductSearchService productSearchService;
    private final NotificationService notificationService;

    /**
     * Create a new product
     */
    @PreAuthorize("hasRole('USER')")
    public Product createProduct(Product product) {
        log.debug("Request to save Product : {}", product);
        
        Optional<User> currentUser = SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneWithAuthoritiesByLogin);
        
        if (currentUser.isEmpty()) {
            throw new IllegalStateException("User not found");
        }
        
        product.setOwner(currentUser.get());
        product.setStatus(ProductStatus.AVAILABLE);
        product.setViews(0);
        product.setInterests(0);
        
        // Set company if user has one
        if (currentUser.get().getProfile() != null && currentUser.get().getProfile().getCompanyId() != null) {
            companyRepository.findById(Long.parseLong(currentUser.get().getProfile().getCompanyId()))
                .ifPresent(product::setCompany);
        }
        
        product = productRepository.save(product);
        
        // Index in Elasticsearch
        productSearchService.indexProduct(product);
        
        // Send notifications for matching interests
        notificationService.notifyProductMatches(product);
        
        log.debug("Created Product : {}", product);
        return product;
    }

    /**
     * Update a product
     */
    @PreAuthorize("hasRole('USER')")
    public Optional<Product> updateProduct(Long id, Product product) {
        log.debug("Request to update Product : {}, {}", id, product);
        
        return productRepository.findById(id)
            .filter(this::canUserModifyProduct)
            .map(existingProduct -> {
                // Copy updatable fields from input product to existingProduct
                existingProduct.setTitle(product.getTitle());
                existingProduct.setDescription(product.getDescription());
                existingProduct.setCategory(product.getCategory());
                existingProduct.setCondition(product.getCondition());
                existingProduct.setQuantity(product.getQuantity());
                existingProduct.setUnit(product.getUnit());
                existingProduct.setEstimatedValue(product.getEstimatedValue());
                existingProduct.setSalePrice(product.getSalePrice());
                existingProduct.setLocation(product.getLocation());
                existingProduct.setImages(product.getImages());
                existingProduct.setTags(product.getTags());
                existingProduct.setExpirationDate(product.getExpirationDate());
                existingProduct.setPickupInstructions(product.getPickupInstructions());
                existingProduct.setUpdatedAt(java.time.Instant.now());
                return existingProduct;
            })
            .map(productRepository::save)
            .map(updatedProduct -> {
                // Update Elasticsearch index
                productSearchService.indexProduct(updatedProduct);
                log.debug("Updated Product : {}", updatedProduct);
                return updatedProduct;
            });
    }

    /**
     * Update product status
     */
    @PreAuthorize("hasRole('USER')")
    public Optional<Product> updateProductStatus(Long id, ProductStatus status) {
        log.debug("Request to update Product status : {}, {}", id, status);
        
        return productRepository.findById(id)
            .filter(this::canUserModifyProduct)
            .map(product -> {
                product.setStatus(status);
                product.setUpdatedAt(java.time.Instant.now());
                return productRepository.save(product);
            })
            .map(updatedProduct -> {
                // Update Elasticsearch index
                productSearchService.indexProduct(updatedProduct);
                log.debug("Updated Product status : {}", updatedProduct);
                return updatedProduct;
            });
    }

    /**
     * Get all products with pagination
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Product> getAllProducts(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable);
    }

    /**
     * Get all available products
     */
    @Transactional(readOnly = true)
    public Page<Product> getAllAvailableProducts(Pageable pageable) {
        log.debug("Request to get all available Products");
        return productRepository.findAllByStatus(ProductStatus.AVAILABLE, pageable);
    }

    /**
     * Get products by owner
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByOwner(Long ownerId, Pageable pageable) {
        log.debug("Request to get Products by owner : {}", ownerId);
        return productRepository.findAllByOwnerId(ownerId, pageable);
    }

    /**
     * Get current user's products
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('USER')")
    public Page<Product> getCurrentUserProducts(Pageable pageable) {
        log.debug("Request to get current user's Products");
        
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .map(user -> productRepository.findAllByOwnerId(user.getId(), pageable))
            .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    /**
     * Get products by company
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCompany(Long companyId, Pageable pageable) {
        log.debug("Request to get Products by company : {}", companyId);
        return productRepository.findAllByCompanyId(companyId, pageable);
    }

    /**
     * Get a product by ID
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public Optional<Product> getProduct(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findById(id)
            .map(product -> {
                // Increment view count
                product.setViews(product.getViews() + 1);
                productRepository.save(product);
                return product;
            });
    }

    /**
     * Delete a product
     */
    @PreAuthorize("hasRole('USER')")
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        log.debug("Request to delete Product : {}", id);
        
        productRepository.findById(id)
            .filter(product -> canUserModifyProduct(product))
            .ifPresent(product -> {
                productRepository.delete(product);
                // Remove from Elasticsearch index
                productSearchService.deleteProductIndex(id);
                log.debug("Deleted Product : {}", id);
            });
    }

    /**
     * Search products
     */
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String query, String category, String location, BigDecimal minPrice, BigDecimal maxPrice, List<String> conditions, Boolean verifiedCompaniesOnly, Pageable pageable) {
        log.debug("Request to search Products : {}", query);
        // Use Elasticsearch for text search and filters
        return productSearchService.searchProducts(query, category, location, minPrice, maxPrice, conditions, verifiedCompaniesOnly, pageable);
    }

    /**
     * Get latest products
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'latest-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Product> getLatestProducts(Pageable pageable) {
        log.debug("Request to get latest Products");
        return productRepository.findLatestAvailableProducts(pageable);
    }

    /**
     * Get most viewed products
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'most-viewed-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Product> getMostViewedProducts(Pageable pageable) {
        log.debug("Request to get most viewed Products");
        return productRepository.findMostViewedProducts(pageable);
    }

    /**
     * Get products from verified companies
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsFromVerifiedCompanies(Pageable pageable) {
        log.debug("Request to get Products from verified companies");
        return productRepository.findLatestFromVerifiedCompanies(pageable);
    }

    /**
     * Get products by category
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        log.debug("Request to get Products by category : {}", category);
        return productRepository.findAllByCategory(
            com.surplus360.domain.enums.ProductCategory.valueOf(category.toUpperCase()),
            pageable
        );
    }

    /**
     * Get products by location
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByLocation(String location, Pageable pageable) {
        log.debug("Request to get Products by location : {}", location);
        return productRepository.findAllByLocationContaining(location, pageable);
    }

    /**
     * Get products by price range
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Request to get Products by price range : {} - {}", minPrice, maxPrice);
        return productRepository.findAllBySalePriceBetween(minPrice, maxPrice, pageable);
    }

    /**
     * Get expiring products
     */
    @Transactional(readOnly = true)
    public List<Product> getExpiringProducts(int days) {
        log.debug("Request to get expiring Products within {} days", days);
        LocalDate expirationDate = LocalDate.now().plusDays(days);
        return productRepository.findAllByExpirationDateBefore(expirationDate);
    }

    /**
     * Increment product interest count
     */
    @PreAuthorize("hasRole('USER')")
    public void incrementInterest(Long productId) {
        log.debug("Request to increment interest for Product : {}", productId);
        
        productRepository.findById(productId)
            .filter(product -> !product.getOwner().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")))
            .ifPresent(product -> {
                product.setInterests(product.getInterests() + 1);
                productRepository.save(product);
                
                // Notify product owner
                notificationService.notifyProductInterest(product);
            });
    }

    /**
     * Get product statistics
     */
    @Transactional(readOnly = true)
    public ProductStatistics getProductStatistics() {
        log.debug("Request to get Product statistics");
        
        return ProductStatistics.builder()
            .totalProducts(productRepository.count())
            .availableProducts(productRepository.countByStatus(ProductStatus.AVAILABLE))
            .reservedProducts(productRepository.countByStatus(ProductStatus.RESERVED))
            .completedProducts(productRepository.countByStatus(ProductStatus.COMPLETED))
            .build();
    }

    /**
     * Check if current user can modify the product
     */
    private boolean canUserModifyProduct(Product product) {
        return SecurityUtils.getCurrentUserLogin()
            .map(login -> product.getOwner().getLogin().equals(login) || 
                         SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN"))
            .orElse(false);
    }

    /**
     * Product statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class ProductStatistics {
        private long totalProducts;
        private long availableProducts;
        private long reservedProducts;
        private long completedProducts;
    }
}