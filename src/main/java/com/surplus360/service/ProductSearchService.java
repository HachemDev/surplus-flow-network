package com.surplus360.service;

import com.surplus360.domain.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductSearchService {

    private final ElasticsearchOperations elasticsearchOperations;

    /**
     * Index a product in Elasticsearch
     */
    public void indexProduct(Product product) {
        try {
            elasticsearchOperations.save(product);
            log.debug("Product indexed: {}", product.getId());
        } catch (Exception e) {
            log.error("Error indexing product: {}", product.getId(), e);
        }
    }

    /**
     * Delete product from Elasticsearch index
     */
    public void deleteProductIndex(Long productId) {
        try {
            elasticsearchOperations.delete(productId.toString(), Product.class);
            log.debug("Product removed from index: {}", productId);
        } catch (Exception e) {
            log.error("Error removing product from index: {}", productId, e);
        }
    }

    /**
     * Search products using Elasticsearch
     */
    public Page<Product> searchProducts(String query, String category, String location, 
                                        BigDecimal minPrice, BigDecimal maxPrice, List<String> conditions, 
                                        Boolean verifiedCompaniesOnly, Pageable pageable) {
        log.debug("Searching products with query: {}", query);
        try {
            Criteria searchCriteria = buildSearchCriteria(query, category, location, minPrice, maxPrice, conditions, verifiedCompaniesOnly);
            Query searchQuery = new CriteriaQuery(searchCriteria).setPageable(pageable);
            SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
            List<Product> products = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
            return new PageImpl<>(products, pageable, searchHits.getTotalHits());
        } catch (Exception e) {
            log.error("Error searching products", e);
            return new PageImpl<>(List.of(), pageable, 0);
        }
    }

    /**
     * Search products by text query
     */
    public Page<Product> searchProductsByText(String query, Pageable pageable) {
        log.debug("Text search for products: {}", query);
        
        try {
            Criteria criteria = new Criteria("title").contains(query)
                .or("description").contains(query)
                .or("tags").contains(query);
            
            Query searchQuery = new CriteriaQuery(criteria).setPageable(pageable);
            SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
            
            List<Product> products = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
            
            return new PageImpl<>(products, pageable, searchHits.getTotalHits());
            
        } catch (Exception e) {
            log.error("Error in text search", e);
            return new PageImpl<>(List.of(), pageable, 0);
        }
    }

    /**
     * Search products by category
     */
    public Page<Product> searchProductsByCategory(String category, Pageable pageable) {
        log.debug("Category search for products: {}", category);
        
        try {
            Criteria criteria = new Criteria("category").is(category);
            Query searchQuery = new CriteriaQuery(criteria).setPageable(pageable);
            
            SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
            
            List<Product> products = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
            
            return new PageImpl<>(products, pageable, searchHits.getTotalHits());
            
        } catch (Exception e) {
            log.error("Error in category search", e);
            return new PageImpl<>(List.of(), pageable, 0);
        }
    }

    /**
     * Search products by location
     */
    public Page<Product> searchProductsByLocation(String location, Pageable pageable) {
        log.debug("Location search for products: {}", location);
        
        try {
            Criteria criteria = new Criteria("location").contains(location);
            Query searchQuery = new CriteriaQuery(criteria).setPageable(pageable);
            
            SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
            
            List<Product> products = searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
            
            return new PageImpl<>(products, pageable, searchHits.getTotalHits());
            
        } catch (Exception e) {
            log.error("Error in location search", e);
            return new PageImpl<>(List.of(), pageable, 0);
        }
    }

    /**
     * Get search suggestions
     */
    public List<String> getSearchSuggestions(String query) {
        log.debug("Getting search suggestions for: {}", query);
        
        try {
            Criteria criteria = new Criteria("title").contains(query)
                .or("tags").contains(query);
            
            Query searchQuery = new CriteriaQuery(criteria).setMaxResults(10);
            SearchHits<Product> searchHits = elasticsearchOperations.search(searchQuery, Product.class);
            
            return searchHits.stream()
                .map(SearchHit::getContent)
                .map(Product::getTitle)
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting search suggestions", e);
            return List.of();
        }
    }

    /**
     * Reindex all products
     */
    public void reindexAllProducts() {
        log.info("Starting reindexing of all products");
        
        try {
            // Delete existing index
            elasticsearchOperations.indexOps(Product.class).delete();
            
            // Create new index
            elasticsearchOperations.indexOps(Product.class).create();
            elasticsearchOperations.indexOps(Product.class).putMapping();
            
            log.info("Reindexing completed successfully");
            
        } catch (Exception e) {
            log.error("Error during reindexing", e);
        }
    }

    /**
     * Check if Elasticsearch is available
     */
    public boolean isElasticsearchAvailable() {
        try {
            return elasticsearchOperations.indexOps(Product.class).exists();
        } catch (Exception e) {
            log.error("Elasticsearch is not available", e);
            return false;
        }
    }

    /**
     * Build search criteria based on query and filters
     */
    private Criteria buildSearchCriteria(String query, String category, String location, 
                                        BigDecimal minPrice, BigDecimal maxPrice, List<String> conditions, 
                                        Boolean verifiedCompaniesOnly) {
        Criteria searchCriteria = new Criteria();
        // Text search
        if (query != null && !query.trim().isEmpty()) {
            searchCriteria = new Criteria("title").contains(query)
                .or("description").contains(query)
                .or("tags").contains(query);
        }
        if (category != null) {
            searchCriteria = searchCriteria.and("category").is(category);
        }
        if (location != null) {
            searchCriteria = searchCriteria.and("location").contains(location);
        }
        if (minPrice != null) {
            searchCriteria = searchCriteria.and("salePrice").greaterThanEqual(minPrice);
        }
        if (maxPrice != null) {
            searchCriteria = searchCriteria.and("salePrice").lessThanEqual(maxPrice);
        }
        if (conditions != null && !conditions.isEmpty()) {
            Criteria conditionCriteria = new Criteria("condition").in(conditions);
            searchCriteria = searchCriteria.and(conditionCriteria);
        }
        if (verifiedCompaniesOnly != null && verifiedCompaniesOnly) {
            searchCriteria = searchCriteria.and("company.verified").is(true);
        }
        // Always filter for available products
        searchCriteria = searchCriteria.and("status").is("AVAILABLE");
        return searchCriteria;
    }
}