package com.surplus360.web.rest;

import com.surplus360.domain.enums.ProductStatus;
import com.surplus360.service.ProductService;
import com.surplus360.service.dto.ProductDTO;
import com.surplus360.service.dto.ProductSearchCriteriaDTO;
import com.surplus360.web.rest.errors.BadRequestAlertException;
import com.surplus360.web.rest.util.HeaderUtil;
import com.surplus360.web.rest.util.PaginationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private static final String ENTITY_NAME = "product";
    private final ProductService productService;

    /**
     * POST /products : Create a new product.
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) throws URISyntaxException {
        log.debug("REST request to save Product : {}", productDTO);
        
        if (productDTO.getId() != null) {
            throw new BadRequestAlertException("A new product cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        ProductDTO result = productService.createProduct(productDTO);
        
        return ResponseEntity.created(new URI("/api/products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT /products/{id} : Updates an existing product.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        log.debug("REST request to update Product : {}, {}", id, productDTO);
        
        if (productDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        if (!id.equals(productDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        
        Optional<ProductDTO> result = productService.updateProduct(id, productDTO);
        
        return result.map(productDto -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productDto.getId().toString()))
            .body(productDto))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * PATCH /products/{id} : Partial updates given fields of an existing product.
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProductDTO> partialUpdateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        log.debug("REST request to partial update Product partially : {}, {}", id, productDTO);
        
        if (productDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        if (!id.equals(productDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        
        Optional<ProductDTO> result = productService.updateProduct(id, productDTO);
        
        return result.map(productDto -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productDto.getId().toString()))
            .body(productDto))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * GET /products : get all products.
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
        @RequestParam(value = "available", required = false) Boolean available,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "location", required = false) String location,
        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
        @RequestParam(value = "verified", required = false) Boolean verified,
        Pageable pageable
    ) {
        log.debug("REST request to get a page of Products");
        
        Page<ProductDTO> page;
        
        if (available != null && available) {
            page = productService.getAllAvailableProducts(pageable);
        } else if (verified != null && verified) {
            page = productService.getProductsFromVerifiedCompanies(pageable);
        } else if (category != null) {
            page = productService.getProductsByCategory(category, pageable);
        } else if (location != null) {
            page = productService.getProductsByLocation(location, pageable);
        } else if (minPrice != null || maxPrice != null) {
            page = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        } else {
            page = productService.getAllProducts(pageable);
        }
        
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/search : search products.
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
        @RequestParam(value = "query", required = false) String query,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "location", required = false) String location,
        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
        @RequestParam(value = "sortBy", required = false) String sortBy,
        @RequestParam(value = "verified", required = false) Boolean verified,
        Pageable pageable
    ) {
        log.debug("REST request to search Products : {}", query);
        
        ProductSearchCriteriaDTO criteria = new ProductSearchCriteriaDTO();
        criteria.setQuery(query);
        criteria.setLocation(location);
        criteria.setMinPrice(minPrice);
        criteria.setMaxPrice(maxPrice);
        criteria.setSortBy(sortBy);
        criteria.setVerifiedCompaniesOnly(verified);
        
        if (category != null) {
            try {
                criteria.setCategory(com.surplus360.domain.enums.ProductCategory.valueOf(category.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestAlertException("Invalid category", ENTITY_NAME, "invalidcategory");
            }
        }
        
        Page<ProductDTO> page = productService.searchProducts(query, criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/search");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/latest : get latest products.
     */
    @GetMapping("/latest")
    public ResponseEntity<List<ProductDTO>> getLatestProducts(Pageable pageable) {
        log.debug("REST request to get latest Products");
        
        Page<ProductDTO> page = productService.getLatestProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/latest");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/most-viewed : get most viewed products.
     */
    @GetMapping("/most-viewed")
    public ResponseEntity<List<ProductDTO>> getMostViewedProducts(Pageable pageable) {
        log.debug("REST request to get most viewed Products");
        
        Page<ProductDTO> page = productService.getMostViewedProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/most-viewed");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/my : get current user's products.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ProductDTO>> getCurrentUserProducts(Pageable pageable) {
        log.debug("REST request to get current user's Products");
        
        Page<ProductDTO> page = productService.getCurrentUserProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/my");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/company/{companyId} : get products by company.
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCompany(@PathVariable Long companyId, Pageable pageable) {
        log.debug("REST request to get Products by company : {}", companyId);
        
        Page<ProductDTO> page = productService.getProductsByCompany(companyId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/company/" + companyId);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/owner/{ownerId} : get products by owner.
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ProductDTO>> getProductsByOwner(@PathVariable Long ownerId, Pageable pageable) {
        log.debug("REST request to get Products by owner : {}", ownerId);
        
        Page<ProductDTO> page = productService.getProductsByOwner(ownerId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/owner/" + ownerId);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/expiring : get expiring products.
     */
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ProductDTO>> getExpiringProducts(@RequestParam(value = "days", defaultValue = "7") int days) {
        log.debug("REST request to get expiring Products within {} days", days);
        
        List<ProductDTO> products = productService.getExpiringProducts(days);
        return ResponseEntity.ok().body(products);
    }

    /**
     * GET /products/{id} : get the product.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        log.debug("REST request to get Product : {}", id);
        
        Optional<ProductDTO> productDTO = productService.getProduct(id);
        return productDTO.map(product -> ResponseEntity.ok().body(product))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * DELETE /products/{id} : delete the product.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.debug("REST request to delete Product : {}", id);
        
        productService.deleteProduct(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * PUT /products/{id}/status : update product status.
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ProductDTO> updateProductStatus(@PathVariable Long id, @RequestParam ProductStatus status) {
        log.debug("REST request to update Product status : {}, {}", id, status);
        
        Optional<ProductDTO> result = productService.updateProductStatus(id, status);
        
        return result.map(productDto -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productDto.getId().toString()))
            .body(productDto))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * POST /products/{id}/interest : increment product interest.
     */
    @PostMapping("/{id}/interest")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> incrementProductInterest(@PathVariable Long id) {
        log.debug("REST request to increment interest for Product : {}", id);
        
        productService.incrementInterest(id);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /products/statistics : get product statistics.
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductService.ProductStatistics> getProductStatistics() {
        log.debug("REST request to get Product statistics");
        
        ProductService.ProductStatistics statistics = productService.getProductStatistics();
        return ResponseEntity.ok().body(statistics);
    }
}