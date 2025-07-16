package com.surplus360.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.surplus360.domain.enums.ProductCategory;
import com.surplus360.domain.enums.ProductCondition;
import com.surplus360.domain.enums.ProductStatus;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "product")
@Document(indexName = "product")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Getter
@Setter
public class Product extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "title", length = 100, nullable = false)
    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @NotNull
    @Lob
    @Column(name = "description", nullable = false)
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    @Field(type = FieldType.Keyword)
    private ProductCategory category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    @Field(type = FieldType.Keyword)
    private ProductCondition condition;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Field(type = FieldType.Keyword)
    private ProductStatus status;

    @NotNull
    @Min(1)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Size(max = 20)
    @Column(name = "unit", length = 20, nullable = false)
    private String unit;

    @Min(0)
    @Column(name = "estimated_value", precision = 10, scale = 2)
    private BigDecimal estimatedValue;

    @Min(0)
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @NotNull
    @Size(max = 100)
    @Column(name = "location", length = 100, nullable = false)
    @Field(type = FieldType.Text, analyzer = "standard")
    private String location;

    @Lob
    @Column(name = "images")
    private String images;

    @Size(max = 500)
    @Column(name = "tags", length = 500)
    @Field(type = FieldType.Text, analyzer = "standard")
    private String tags;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Lob
    @Column(name = "pickup_instructions")
    private String pickupInstructions;

    @Column(name = "views")
    private Integer views = 0;

    @Column(name = "interests")
    private Integer interests = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Transaction> transactions = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Product{" +
            "id=" + id +
            ", title='" + title + '\'' +
            ", category=" + category +
            ", condition=" + condition +
            ", status=" + status +
            ", quantity=" + quantity +
            ", unit='" + unit + '\'' +
            ", location='" + location + '\'' +
            ", estimatedValue=" + estimatedValue +
            ", salePrice=" + salePrice +
            '}';
    }
}