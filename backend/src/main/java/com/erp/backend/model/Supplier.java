package com.erp.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supplier_code", unique = true)
    private String supplierCode;

    @Column(nullable = false)
    private String companyName;

    private String contactPerson;
    private String phone;
    private String email;
    private String address;

    @Column(name = "payment_terms")
    private String paymentTerms; // e.g. "Net 30", "Cash on Delivery"

    private String category;    // primary category supplied
    private String status = "ACTIVE"; // ACTIVE | INACTIVE

    @Column(name = "total_purchase_value", columnDefinition = "double precision default 0")
    private Double totalPurchaseValue = 0.0;

    @Column(name = "last_delivery_date")
    private LocalDateTime lastDeliveryDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }
    public String getSupplierCode()                  { return supplierCode; }
    public void setSupplierCode(String c)            { this.supplierCode = c; }
    public String getCompanyName()                   { return companyName; }
    public void setCompanyName(String n)             { this.companyName = n; }
    public String getContactPerson()                 { return contactPerson; }
    public void setContactPerson(String c)           { this.contactPerson = c; }
    public String getPhone()                         { return phone; }
    public void setPhone(String p)                   { this.phone = p; }
    public String getEmail()                         { return email; }
    public void setEmail(String e)                   { this.email = e; }
    public String getAddress()                       { return address; }
    public void setAddress(String a)                 { this.address = a; }
    public String getPaymentTerms()                  { return paymentTerms; }
    public void setPaymentTerms(String t)            { this.paymentTerms = t; }
    public String getCategory()                      { return category; }
    public void setCategory(String c)                { this.category = c; }
    public String getStatus()                        { return status; }
    public void setStatus(String s)                  { this.status = s; }
    public Double getTotalPurchaseValue()            { return totalPurchaseValue; }
    public void setTotalPurchaseValue(Double v)      { this.totalPurchaseValue = v; }
    public LocalDateTime getLastDeliveryDate()       { return lastDeliveryDate; }
    public void setLastDeliveryDate(LocalDateTime d) { this.lastDeliveryDate = d; }
    public LocalDateTime getCreatedAt()              { return createdAt; }
}
