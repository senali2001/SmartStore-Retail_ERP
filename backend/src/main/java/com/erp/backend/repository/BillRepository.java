package com.erp.backend.repository;

import com.erp.backend.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end")
    Double sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.investment), 0) FROM Bill b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end")
    Double sumInvestmentBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.discountAmount), 0) FROM Bill b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end")
    Double sumDiscountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT b.customerId) FROM Bill b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end AND b.customerId IS NOT NULL")
    Long countCustomersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT bi.productId, bi.productName, bi.category, " +
           "SUM(bi.quantity) as totalQty, " +
           "SUM(bi.unitPrice * bi.quantity * (1 - COALESCE(bi.discountPercentage,0)/100)) as totalRevenue, " +
           "SUM(bi.buyingPrice * bi.quantity) as totalInvestment " +
           "FROM BillItem bi JOIN bi.bill b " +
           "WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end " +
           "GROUP BY bi.productId, bi.productName, bi.category " +
           "ORDER BY totalQty DESC")
    List<Object[]> findTopProductsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT bi.category, SUM(bi.unitPrice * bi.quantity * (1 - COALESCE(bi.discountPercentage,0)/100)) " +
           "FROM BillItem bi JOIN bi.bill b " +
           "WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end " +
           "GROUP BY bi.category")
    List<Object[]> findRevenueByCategoryBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT EXTRACT(MONTH FROM b.createdAt), COALESCE(SUM(b.totalAmount),0), COALESCE(SUM(b.investment),0) " +
           "FROM Bill b WHERE b.status = 'COMPLETED' AND EXTRACT(YEAR FROM b.createdAt) = :year " +
           "GROUP BY EXTRACT(MONTH FROM b.createdAt) ORDER BY EXTRACT(MONTH FROM b.createdAt)")
    List<Object[]> findMonthlyRevenuForYear(@Param("year") int year);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.status = 'COMPLETED' AND b.createdAt >= :start AND b.createdAt < :end")
    Long countCompletedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
