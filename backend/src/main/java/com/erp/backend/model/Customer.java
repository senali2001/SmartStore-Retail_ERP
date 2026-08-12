package com.erp.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String phone;

    private String email;
    private String address;
    private LocalDate birthday;

    @Column(name = "loyalty_points", columnDefinition = "integer default 0")
    private Integer loyaltyPoints = 0;

    @Column(name = "total_spending", columnDefinition = "double precision default 0")
    private Double totalSpending = 0.0;

    @Column(name = "total_orders", columnDefinition = "integer default 0")
    private Integer totalOrders = 0;

    @Column(name = "membership_level")
    private String membershipLevel = "NORMAL"; // NORMAL, SILVER, GOLD

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "last_purchase_date")
    private LocalDateTime lastPurchaseDate;

    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) registrationDate = LocalDateTime.now();
        updateMembership();
    }

    @PreUpdate
    protected void onUpdate() {
        updateMembership();
    }

    public void updateMembership() {
        int pts = loyaltyPoints != null ? loyaltyPoints : 0;
        if (pts >= 5000)      membershipLevel = "GOLD";
        else if (pts >= 1000) membershipLevel = "SILVER";
        else                   membershipLevel = "NORMAL";
    }

    /** Add points for a purchase: 1 point per Rs.100 */
    public void addPointsForPurchase(double amount) {
        int earned = (int)(amount / 100.0);
        this.loyaltyPoints = (this.loyaltyPoints != null ? this.loyaltyPoints : 0) + earned;
        this.totalSpending = (this.totalSpending != null ? this.totalSpending : 0.0) + amount;
        this.totalOrders   = (this.totalOrders   != null ? this.totalOrders   : 0) + 1;
        this.lastPurchaseDate = LocalDateTime.now();
        updateMembership();
    }

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }
    public String getPhone()                     { return phone; }
    public void setPhone(String phone)           { this.phone = phone; }
    public String getEmail()                     { return email; }
    public void setEmail(String email)           { this.email = email; }
    public String getAddress()                   { return address; }
    public void setAddress(String address)       { this.address = address; }
    public LocalDate getBirthday()               { return birthday; }
    public void setBirthday(LocalDate birthday)  { this.birthday = birthday; }
    public Integer getLoyaltyPoints()            { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer p)      { this.loyaltyPoints = p; }
    public Double getTotalSpending()             { return totalSpending; }
    public void setTotalSpending(Double s)       { this.totalSpending = s; }
    public Integer getTotalOrders()              { return totalOrders; }
    public void setTotalOrders(Integer o)        { this.totalOrders = o; }
    public String getMembershipLevel()           { return membershipLevel; }
    public void setMembershipLevel(String m)     { this.membershipLevel = m; }
    public LocalDateTime getRegistrationDate()   { return registrationDate; }
    public void setRegistrationDate(LocalDateTime d) { this.registrationDate = d; }
    public LocalDateTime getLastPurchaseDate()   { return lastPurchaseDate; }
    public void setLastPurchaseDate(LocalDateTime d) { this.lastPurchaseDate = d; }
}
