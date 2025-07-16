package com.surplus360.service.dto;

import com.surplus360.domain.enums.TransactionStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogisticsDTO {

    private Long id;

    @NotBlank
    @Size(max = 100)
    private String carrierName;

    @NotBlank
    @Size(max = 100)
    private String trackingNumber;

    private Instant pickupDate;

    private Instant estimatedDelivery;

    private Instant actualDelivery;

    @NotNull
    private TransactionStatus status;

    private BigDecimal cost;

    @NotBlank
    private String pickupAddress;

    @NotBlank
    private String deliveryAddress;

    @NotBlank
    @Size(max = 100)
    private String contactPerson;

    @NotBlank
    @Size(max = 20)
    private String contactPhone;

    private String specialInstructions;

    private Long transactionId;

    private List<TrackingEventDTO> trackingHistory;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from Logistics entity
    public LogisticsDTO(Long id, String carrierName, String trackingNumber, 
                       Instant pickupDate, Instant estimatedDelivery, 
                       Instant actualDelivery, TransactionStatus status, 
                       BigDecimal cost, String pickupAddress, String deliveryAddress, 
                       String contactPerson, String contactPhone, 
                       String specialInstructions, Long transactionId, 
                       Instant createdDate) {
        this.id = id;
        this.carrierName = carrierName;
        this.trackingNumber = trackingNumber;
        this.pickupDate = pickupDate;
        this.estimatedDelivery = estimatedDelivery;
        this.actualDelivery = actualDelivery;
        this.status = status;
        this.cost = cost;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.specialInstructions = specialInstructions;
        this.transactionId = transactionId;
        this.createdDate = createdDate;
    }
}