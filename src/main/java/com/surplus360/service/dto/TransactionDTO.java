package com.surplus360.service.dto;

import com.surplus360.domain.enums.TransactionStatus;
import com.surplus360.domain.enums.TransactionType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;

    @NotNull
    private TransactionType type;

    @NotNull
    private TransactionStatus status;

    @NotNull
    @Min(0)
    private BigDecimal price;

    @NotNull
    @Min(1)
    private Integer quantity;

    private String message;

    private String documents;

    private String logistics;

    private Instant acceptedAt;

    private Instant completedAt;

    private Instant cancelledAt;

    private String cancelReason;

    private Long productId;

    private ProductDTO product;

    private Long buyerId;

    private String buyerName;

    private Long sellerId;

    private String sellerName;

    private LogisticsDTO logisticsDetail;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from Transaction entity
    public TransactionDTO(Long id, TransactionType type, TransactionStatus status, 
                         BigDecimal price, Integer quantity, String message, 
                         String documents, String logistics, Instant acceptedAt, 
                         Instant completedAt, Instant cancelledAt, String cancelReason, 
                         Long productId, Long buyerId, Long sellerId, Instant createdDate) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.price = price;
        this.quantity = quantity;
        this.message = message;
        this.documents = documents;
        this.logistics = logistics;
        this.acceptedAt = acceptedAt;
        this.completedAt = completedAt;
        this.cancelledAt = cancelledAt;
        this.cancelReason = cancelReason;
        this.productId = productId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.createdDate = createdDate;
    }
}