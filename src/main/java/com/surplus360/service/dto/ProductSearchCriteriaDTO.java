package com.surplus360.service.dto;

import com.surplus360.domain.enums.ProductCategory;
import com.surplus360.domain.enums.ProductCondition;
import com.surplus360.domain.enums.TransactionType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchCriteriaDTO {

    private String query;
    private ProductCategory category;
    private String location;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<ProductCondition> conditions;
    private List<TransactionType> transactionTypes;
    private List<String> tags;
    private String sortBy = "NEWEST"; // NEWEST, PRICE_LOW, PRICE_HIGH, DISTANCE, RELEVANCE
    private Boolean verifiedCompaniesOnly = false;
    private Integer radius; // in kilometers
    private String coordinates; // "lat,lng"

    public ProductSearchCriteriaDTO(String query, ProductCategory category, String location, 
                                   BigDecimal minPrice, BigDecimal maxPrice, String sortBy) {
        this.query = query;
        this.category = category;
        this.location = location;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.sortBy = sortBy != null ? sortBy : "NEWEST";
    }
}