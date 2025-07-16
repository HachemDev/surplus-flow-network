package com.surplus360.web.rest;

import com.surplus360.domain.enums.ProductStatus;
import com.surplus360.service.ProductService;
import com.surplus360.domain.Product;
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
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) throws URISyntaxException {
        log.debug("REST request to save Product : {}", product);
        
        if (product.getId() != null) {
            throw new BadRequestAlertException("A new product cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        Product result = productService.createProduct(product);
        
        return ResponseEntity.created(new URI("/api/products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT /products/{id} : Updates an existing product.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        log.debug("REST request to update Product : {}, {}", id, product);
        
        if (product.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        if (!id.equals(product.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        
        Optional<Product> result = productService.updateProduct(id, product);
        
        return result.map(updatedProduct -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, updatedProduct.getId().toString()))
            .body(updatedProduct))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * PATCH /products/{id} : Partial updates given fields of an existing product.
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Product> partialUpdateProduct(@PathVariable Long id, @RequestBody Product product) {
        log.debug("REST request to partial update Product partially : {}, {}", id, product);
        
        if (product.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        
        if (!id.equals(product.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        
        Optional<Product> result = productService.updateProduct(id, product);
        
        return result.map(updatedProduct -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, updatedProduct.getId().toString()))
            .body(updatedProduct))
            .orElseThrow(() -> new BadRequestAlertException("Product not found", ENTITY_NAME, "notfound"));
    }

    /**
     * GET /products : get all products.
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
        @RequestParam(value = "available", required = false) Boolean available,
        @RequestParam(value = "category", required = false) String category,
        @RequestParam(value = "location", required = false) String location,
        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
        @RequestParam(value = "verified", required = false) Boolean verified,
        Pageable pageable
    ) {
        log.debug("REST request to get a page of Products");
        
        Page<Product> page;
        
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
    public ResponseEntity<List<Product>> searchProducts(
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
        // Call the new ProductService signature
        Page<Product> page = productService.searchProducts(
            query,
            category,
            location,
            minPrice,
            maxPrice,
            null, // conditions (if needed, add as a request param)
            verified,
            pageable
        );
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/search");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/latest : get latest products.
     */
    @GetMapping("/latest")
    public ResponseEntity<List<Product>> getLatestProducts(Pageable pageable) {
        log.debug("REST request to get latest Products");
        
        Page<Product> page = productService.getLatestProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/latest");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/most-viewed : get most viewed products.
     */
    @GetMapping("/most-viewed")
    public ResponseEntity<List<Product>> getMostViewedProducts(Pageable pageable) {
        log.debug("REST request to get most viewed Products");
        
        Page<Product> page = productService.getMostViewedProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/most-viewed");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/my : get current user's products.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Product>> getCurrentUserProducts(Pageable pageable) {
        log.debug("REST request to get current user's Products");
        
        Page<Product> page = productService.getCurrentUserProducts(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/my");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/company/{companyId} : get products by company.
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Product>> getProductsByCompany(@PathVariable Long companyId, Pageable pageable) {
        log.debug("REST request to get Products by company : {}", companyId);
        
        Page<Product> page = productService.getProductsByCompany(companyId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/company/" + companyId);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/owner/{ownerId} : get products by owner.
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Product>> getProductsByOwner(@PathVariable Long ownerId, Pageable pageable) {
        log.debug("REST request to get Products by owner : {}", ownerId);
        
        Page<Product> page = productService.getProductsByOwner(ownerId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/products/owner/" + ownerId);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /products/expiring : get expiring products.
     */
    @GetMapping("/expiring")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Product>> getExpiringProducts(@RequestParam(value = "days", defaultValue = "7") int days) {
        log.debug("REST request to get expiring Products within {} days", days);
        
        List<Product> products = productService.getExpiringProducts(days);
        return ResponseEntity.ok().body(products);
    }

    /**
     * GET /products/{id} : get the product.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        log.debug("REST request to get Product : {}", id);
        
        Optional<Product> product = productService.getProduct(id);
        return product.map(productObj -> ResponseEntity.ok().body(productObj))
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
    public ResponseEntity<Product> updateProductStatus(@PathVariable Long id, @RequestParam ProductStatus status) {
        log.debug("REST request to update Product status : {}, {}", id, status);
        
        Optional<Product> result = productService.updateProductStatus(id, status);
        
        return result.map(updatedProduct -> ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, updatedProduct.getId().toString()))
            .body(updatedProduct))
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