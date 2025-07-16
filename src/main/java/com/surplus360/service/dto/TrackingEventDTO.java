package com.surplus360.service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEventDTO {

    private Long id;

    @NotNull
    private Instant timestamp;

    @NotBlank
    @Size(max = 100)
    private String location;

    @NotBlank
    @Size(max = 50)
    private String status;

    @NotBlank
    private String description;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private Long logisticsId;

    private Instant createdDate;

    private Instant lastModifiedDate;

    // Constructor for creating DTO from TrackingEvent entity
    public TrackingEventDTO(Long id, Instant timestamp, String location, 
                           String status, String description, BigDecimal latitude, 
                           BigDecimal longitude, Long logisticsId, Instant createdDate) {
        this.id = id;
        this.timestamp = timestamp;
        this.location = location;
        this.status = status;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.logisticsId = logisticsId;
        this.createdDate = createdDate;
    }

    // Helper method to get coordinates as object
    public CoordinatesDTO getCoordinates() {
        if (latitude != null && longitude != null) {
            return new CoordinatesDTO(latitude, longitude);
        }
        return null;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoordinatesDTO {
        private BigDecimal lat;
        private BigDecimal lng;
    }
}