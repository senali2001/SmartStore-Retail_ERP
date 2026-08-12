package com.erp.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productName;
    private String category;

    private Double unitPrice;       // selling price at time of sale
    private Double buyingPrice;     // buying/cost price snapshot for investment calc
    private Integer quantity;
    private Double discountPercentage;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }
    public Long getProductId()                       { return productId; }
    public void setProductId(Long p)                 { this.productId = p; }
    public String getProductName()                   { return productName; }
    public void setProductName(String n)             { this.productName = n; }
    public String getCategory()                      { return category; }
    public void setCategory(String c)                { this.category = c; }
    public Double getUnitPrice()                     { return unitPrice; }
    public void setUnitPrice(Double u)               { this.unitPrice = u; }
    public Double getBuyingPrice()                   { return buyingPrice; }
    public void setBuyingPrice(Double b)             { this.buyingPrice = b; }
    public Integer getQuantity()                     { return quantity; }
    public void setQuantity(Integer q)               { this.quantity = q; }
    public Double getDiscountPercentage()            { return discountPercentage; }
    public void setDiscountPercentage(Double d)      { this.discountPercentage = d; }
    public Bill getBill()                            { return bill; }
    public void setBill(Bill b)                      { this.bill = b; }
}
