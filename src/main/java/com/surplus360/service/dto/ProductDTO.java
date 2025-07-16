package com.surplus360.service.dto;

import com.surplus360.domain.enums.ProductCategory;
import com.surplus360.domain.enums.ProductCondition;
import com.surplus360.domain.enums.ProductStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private ProductCategory category;

    @NotNull
    private ProductCondition condition;

    @NotNull
    private ProductStatus status;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    @Size(max = 20)
    private String unit;

    @Min(0)
    private BigDecimal estimatedValue;

    @Min(0)
    private BigDecimal salePrice;

    @NotBlank
    @Size(max = 100)
    private String location;

    private List<String> images;

    @Size(max = 500)
    private String tags;

    private LocalDate expirationDate;

    private String pickupInstructions;

    private Integer views = 0;

    private Integer interests = 0;

    private Long ownerId;

    private String ownerName;

    private Long companyId;

    private CompanyDTO company;

    private List<TransactionDTO> transactions;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from Product entity
    public ProductDTO(Long id, String title, String description, ProductCategory category, 
                     ProductCondition condition, ProductStatus status, Integer quantity, 
                     String unit, BigDecimal estimatedValue, BigDecimal salePrice, 
                     String location, String images, String tags, LocalDate expirationDate, 
                     String pickupInstructions, Integer views, Integer interests, 
                     Long ownerId, Long companyId, Instant createdDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.condition = condition;
        this.status = status;
        this.quantity = quantity;
        this.unit = unit;
        this.estimatedValue = estimatedValue;
        this.salePrice = salePrice;
        this.location = location;
        this.images = parseImages(images);
        this.tags = tags;
        this.expirationDate = expirationDate;
        this.pickupInstructions = pickupInstructions;
        this.views = views;
        this.interests = interests;
        this.ownerId = ownerId;
        this.companyId = companyId;
        this.createdDate = createdDate;
    }

    // Helper method to parse images JSON string to List
    private List<String> parseImages(String imagesJson) {
        if (imagesJson == null || imagesJson.isEmpty()) {
            return List.of();
        }
        try {
            // Simple JSON parsing - in production, use Jackson or similar
            return List.of(imagesJson.replace("[", "").replace("]", "")
                          .replace("\"", "").split(","));
        } catch (Exception e) {
            return List.of();
        }
    }

    // Helper method to convert List to JSON string
    public String getImagesAsJson() {
        if (images == null || images.isEmpty()) {
            return "[]";
        }
        return "[\"" + String.join("\", \"", images) + "\"]";
    }
}