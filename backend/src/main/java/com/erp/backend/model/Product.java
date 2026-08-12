package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private String category;
    private String unitType;
    private Double stockQuantity;
    private Double minimumStockLevel;
    private Double buyingPrice;
    private Double sellingPrice;
    private Double discountPercentage;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;

    private Long supplierId;
    private String supplierName;

    private String barcode;
    private String brand;
    private String batchNumber;
}