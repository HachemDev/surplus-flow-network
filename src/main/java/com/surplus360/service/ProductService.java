package com.surplus360.service;

import com.surplus360.domain.Product;
import com.surplus360.domain.User;
import com.surplus360.domain.enums.ProductStatus;
import com.surplus360.repository.CompanyRepository;
import com.surplus360.repository.ProductRepository;
import com.surplus360.repository.UserRepository;
import com.surplus360.security.SecurityUtils;
import com.surplus360.service.dto.ProductDTO;
import com.surplus360.service.dto.ProductSearchCriteriaDTO;
import com.surplus360.service.mapper.ProductMapper;
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
    private final ProductMapper productMapper;
    private final ProductSearchService productSearchService;
    private final NotificationService notificationService;

    /**
     * Create a new product
     */
    @PreAuthorize("hasRole('USER')")
    public ProductDTO createProduct(ProductDTO productDTO) {
        log.debug("Request to save Product : {}", productDTO);
        
        Optional<User> currentUser = SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneWithAuthoritiesByLogin);
        
        if (currentUser.isEmpty()) {
            throw new IllegalStateException("User not found");
        }
        
        Product product = productMapper.toEntity(productDTO);
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
        return productMapper.toDto(product);
    }

    /**
     * Update a product
     */
    @PreAuthorize("hasRole('USER')")
    public Optional<ProductDTO> updateProduct(Long id, ProductDTO productDTO) {
        log.debug("Request to update Product : {}, {}", id, productDTO);
        
        return productRepository.findById(id)
            .filter(product -> canUserModifyProduct(product))
            .map(existingProduct -> {
                productMapper.partialUpdate(productDTO, existingProduct);
                existingProduct.setUpdatedAt(Instant.now());
                return existingProduct;
            })
            .map(productRepository::save)
            .map(updatedProduct -> {
                // Update Elasticsearch index
                productSearchService.indexProduct(updatedProduct);
                log.debug("Updated Product : {}", updatedProduct);
                return productMapper.toDto(updatedProduct);
            });
    }

    /**
     * Update product status
     */
    @PreAuthorize("hasRole('USER')")
    public Optional<ProductDTO> updateProductStatus(Long id, ProductStatus status) {
        log.debug("Request to update Product status : {}, {}", id, status);
        
        return productRepository.findById(id)
            .filter(product -> canUserModifyProduct(product))
            .map(product -> {
                product.setStatus(status);
                product.setUpdatedAt(Instant.now());
                return productRepository.save(product);
            })
            .map(updatedProduct -> {
                // Update Elasticsearch index
                productSearchService.indexProduct(updatedProduct);
                log.debug("Updated Product status : {}", updatedProduct);
                return productMapper.toDto(updatedProduct);
            });
    }

    /**
     * Get all products with pagination
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        log.debug("Request to get all Products");
        return productRepository.findAll(pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get all available products
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllAvailableProducts(Pageable pageable) {
        log.debug("Request to get all available Products");
        return productRepository.findAllByStatus(ProductStatus.AVAILABLE, pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get products by owner
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByOwner(Long ownerId, Pageable pageable) {
        log.debug("Request to get Products by owner : {}", ownerId);
        return productRepository.findAllByOwnerId(ownerId, pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get current user's products
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('USER')")
    public Page<ProductDTO> getCurrentUserProducts(Pageable pageable) {
        log.debug("Request to get current user's Products");
        
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .map(user -> productRepository.findAllByOwnerId(user.getId(), pageable))
            .orElseThrow(() -> new IllegalStateException("User not found"))
            .map(productMapper::toDto);
    }

    /**
     * Get products by company
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByCompany(Long companyId, Pageable pageable) {
        log.debug("Request to get Products by company : {}", companyId);
        return productRepository.findAllByCompanyId(companyId, pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get a product by ID
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public Optional<ProductDTO> getProduct(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findById(id)
            .map(product -> {
                // Increment view count
                product.setViews(product.getViews() + 1);
                productRepository.save(product);
                return productMapper.toDto(product);
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
    public Page<ProductDTO> searchProducts(String query, ProductSearchCriteriaDTO criteria, Pageable pageable) {
        log.debug("Request to search Products : {}", query);
        
        if (query != null && !query.trim().isEmpty()) {
            // Use Elasticsearch for text search
            return productSearchService.searchProducts(query, criteria, pageable)
                .map(productMapper::toDto);
        } else {
            // Use database filters
            return productRepository.findAvailableProductsWithFilters(
                criteria.getCategory(),
                criteria.getLocation(),
                criteria.getMinPrice(),
                criteria.getMaxPrice(),
                pageable
            ).map(productMapper::toDto);
        }
    }

    /**
     * Get latest products
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'latest-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<ProductDTO> getLatestProducts(Pageable pageable) {
        log.debug("Request to get latest Products");
        return productRepository.findLatestAvailableProducts(pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get most viewed products
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'most-viewed-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<ProductDTO> getMostViewedProducts(Pageable pageable) {
        log.debug("Request to get most viewed Products");
        return productRepository.findMostViewedProducts(pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get products from verified companies
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsFromVerifiedCompanies(Pageable pageable) {
        log.debug("Request to get Products from verified companies");
        return productRepository.findLatestFromVerifiedCompanies(pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get products by category
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByCategory(String category, Pageable pageable) {
        log.debug("Request to get Products by category : {}", category);
        return productRepository.findAllByCategory(
            com.surplus360.domain.enums.ProductCategory.valueOf(category.toUpperCase()),
            pageable
        ).map(productMapper::toDto);
    }

    /**
     * Get products by location
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByLocation(String location, Pageable pageable) {
        log.debug("Request to get Products by location : {}", location);
        return productRepository.findAllByLocationContaining(location, pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get products by price range
     */
    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Request to get Products by price range : {} - {}", minPrice, maxPrice);
        return productRepository.findAllBySalePriceBetween(minPrice, maxPrice, pageable)
            .map(productMapper::toDto);
    }

    /**
     * Get expiring products
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> getExpiringProducts(int days) {
        log.debug("Request to get expiring Products within {} days", days);
        LocalDate expirationDate = LocalDate.now().plusDays(days);
        return productRepository.findAllByExpirationDateBefore(expirationDate)
            .stream()
            .map(productMapper::toDto)
            .toList();
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