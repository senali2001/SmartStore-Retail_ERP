package com.erp.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String billNumber;

    private String cashierName;

    // Customer linkage (nullable = walk-in)
    private Long customerId;
    private String customerName;

    private Double subtotal;
    private Double discountAmount;
    private Double totalAmount;
    private Double receivedAmount;
    private Double balance;

    // Investment = Σ(buyingPrice × qty) — calculated and stored for fast reporting
    private Double investment;

    // Status: COMPLETED | CANCELLED
    private String status = "COMPLETED";

    // Payment method: CASH | CARD | MOBILE
    private String paymentMethod = "CASH";

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<BillItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (billNumber == null || billNumber.isBlank()) {
            billNumber = "INV-" + createdAt.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        }
    }

    public void addItem(BillItem item) {
        items.add(item);
        item.setBill(this);
    }

    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }
    public String getBillNumber()                    { return billNumber; }
    public void setBillNumber(String b)              { this.billNumber = b; }
    public String getCashierName()                   { return cashierName; }
    public void setCashierName(String c)             { this.cashierName = c; }
    public Long getCustomerId()                      { return customerId; }
    public void setCustomerId(Long c)                { this.customerId = c; }
    public String getCustomerName()                  { return customerName; }
    public void setCustomerName(String c)            { this.customerName = c; }
    public Double getSubtotal()                      { return subtotal; }
    public void setSubtotal(Double s)                { this.subtotal = s; }
    public Double getDiscountAmount()                { return discountAmount; }
    public void setDiscountAmount(Double d)          { this.discountAmount = d; }
    public Double getTotalAmount()                   { return totalAmount; }
    public void setTotalAmount(Double t)             { this.totalAmount = t; }
    public Double getReceivedAmount()                { return receivedAmount; }
    public void setReceivedAmount(Double r)          { this.receivedAmount = r; }
    public Double getBalance()                       { return balance; }
    public void setBalance(Double b)                 { this.balance = b; }
    public Double getInvestment()                    { return investment; }
    public void setInvestment(Double i)              { this.investment = i; }
    public String getStatus()                        { return status; }
    public void setStatus(String s)                  { this.status = s; }
    public String getPaymentMethod()                 { return paymentMethod; }
    public void setPaymentMethod(String p)           { this.paymentMethod = p; }
    public LocalDateTime getCreatedAt()              { return createdAt; }
    public void setCreatedAt(LocalDateTime c)        { this.createdAt = c; }
    public List<BillItem> getItems()                 { return items; }
    public void setItems(List<BillItem> items)       { this.items = items; }
}
