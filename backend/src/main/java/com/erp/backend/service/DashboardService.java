package com.erp.backend.service;

import com.erp.backend.model.Customer;
import com.erp.backend.model.Product;
import com.erp.backend.repository.BillRepository;
import com.erp.backend.repository.CustomerRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class DashboardService {

    private final BillRepository        billRepository;
    private final ProductRepository     productRepository;
    private final CustomerRepository    customerRepository;
    private final SupplierRepository    supplierRepository;

    private static final String[] MONTHS = {
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    };

    public DashboardService(BillRepository billRepository,
                            ProductRepository productRepository,
                            CustomerRepository customerRepository,
                            SupplierRepository supplierRepository) {
        this.billRepository     = billRepository;
        this.productRepository  = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Colombo"));
        LocalDateTime todayStart  = today.atStartOfDay();
        LocalDateTime todayEnd    = today.plusDays(1).atStartOfDay();
        LocalDateTime monthStart  = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime yearStart   = today.withDayOfYear(1).atStartOfDay();
        LocalDateTime yearEnd     = today.plusYears(1).withDayOfYear(1).atStartOfDay();

        double todayRevenue    = safe(billRepository.sumRevenueBetween(todayStart, todayEnd));
        double todayInvestment = safe(billRepository.sumInvestmentBetween(todayStart, todayEnd));
        double todayDiscount   = safe(billRepository.sumDiscountBetween(todayStart, todayEnd));
        double todayProfit     = todayRevenue - todayInvestment;
        double profitPct       = todayInvestment > 0 ? (todayProfit / todayInvestment) * 100 : 0;
        long   todayCustomers  = safeLong(billRepository.countCustomersBetween(todayStart, todayEnd));
        long   todayOrders     = safeLong(billRepository.countCompletedBetween(todayStart, todayEnd));

        stats.put("todayRevenue",    round2(todayRevenue));
        stats.put("todayInvestment", round2(todayInvestment));
        stats.put("todayProfit",     round2(todayProfit));
        stats.put("todayDiscount",   round2(todayDiscount));
        stats.put("profitPct",       round2(profitPct));
        stats.put("todayCustomers",  todayCustomers);
        stats.put("todayOrders",     todayOrders);

        double monthRevenue  = safe(billRepository.sumRevenueBetween(monthStart, todayEnd));
        double yearRevenue   = safe(billRepository.sumRevenueBetween(yearStart, yearEnd));
        stats.put("monthRevenue", round2(monthRevenue));
        stats.put("yearRevenue",  round2(yearRevenue));

        stats.put("totalCustomers",   customerRepository.count());
        stats.put("silverMembers",    customerRepository.countSilverMembers());
        stats.put("goldMembers",      customerRepository.countGoldMembers());
        stats.put("newCustomers",     customerRepository.countNewToday());
        stats.put("returningCustomers", customerRepository.countReturning());

        List<Object[]> topRows = billRepository.findTopProductsBetween(monthStart, todayEnd);
        List<Map<String, Object>> topProducts = new ArrayList<>();
        int rank = 1;
        for (Object[] row : topRows) {
            if (rank > 10) break;
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("rank",        rank++);
            p.put("productId",   row[0]);
            p.put("productName", row[1]);
            p.put("category",    row[2]);
            p.put("sold",        row[3]);
            double rev = ((Number) row[4]).doubleValue();
            double inv = ((Number) row[5]).doubleValue();
            p.put("revenue",     round2(rev));
            p.put("investment",  round2(inv));
            p.put("profit",      round2(rev - inv));
            p.put("margin",      inv > 0 ? round2(((rev - inv) / rev) * 100) : 0);
            topProducts.add(p);
        }
        stats.put("topProducts", topProducts);

        List<Object[]> catRows = billRepository.findRevenueByCategoryBetween(monthStart, todayEnd);
        double catTotal = catRows.stream().mapToDouble(r -> ((Number)r[1]).doubleValue()).sum();
        List<Map<String, Object>> categories = new ArrayList<>();
        for (Object[] row : catRows) {
            double rev = ((Number) row[1]).doubleValue();
            Map<String, Object> c = new LinkedHashMap<>();
            c.put("name",  row[0] != null ? row[0] : "Uncategorised");
            c.put("value", catTotal > 0 ? round2((rev / catTotal) * 100) : 0);
            c.put("revenue", round2(rev));
            categories.add(c);
        }
        stats.put("categoryBreakdown", categories);

        List<Object[]> monthlyRows = billRepository.findMonthlyRevenuForYear(today.getYear());
        Map<Integer, Object[]> monthlyMap = new HashMap<>();
        for (Object[] row : monthlyRows) monthlyMap.put(((Number)row[0]).intValue(), row);

        List<Map<String, Object>> monthlyChart = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Object[] row = monthlyMap.get(m);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month",      MONTHS[m - 1]);
            double rev = row != null ? ((Number)row[1]).doubleValue() : 0;
            double inv = row != null ? ((Number)row[2]).doubleValue() : 0;
            entry.put("revenue",    round2(rev));
            entry.put("investment", round2(inv));
            entry.put("profit",     round2(rev - inv));
            monthlyChart.add(entry);
        }
        stats.put("monthlyChart", monthlyChart);

        List<Product> allProducts = productRepository.findAll();
        LocalDate now = LocalDate.now();

        List<Map<String, Object>> criticalStock = new ArrayList<>();
        List<Map<String, Object>> lowStock      = new ArrayList<>();
        List<Map<String, Object>> expiredList   = new ArrayList<>();
        List<Map<String, Object>> expiringSoon  = new ArrayList<>();  // ≤ 7 days
        List<Map<String, Object>> expiringMonth = new ArrayList<>();  // 8–30 days

        for (Product p : allProducts) {
            double qty = p.getStockQuantity() != null ? p.getStockQuantity() : 0;
            double min = p.getMinimumStockLevel() != null ? p.getMinimumStockLevel() : 0;

            if (qty <= 0 || (min > 0 && qty <= min * 0.3)) {
                criticalStock.add(stockMap(p, qty));
            } else if (min > 0 && qty <= min) {
                lowStock.add(stockMap(p, qty));
            }

            if (p.getExpiryDate() != null) {
                long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(now, p.getExpiryDate());
                if (daysLeft < 0) {
                    expiredList.add(expiryMap(p, daysLeft));
                } else if (daysLeft <= 7) {
                    expiringSoon.add(expiryMap(p, daysLeft));
                } else if (daysLeft <= 30) {
                    expiringMonth.add(expiryMap(p, daysLeft));
                }
            }
        }

        stats.put("criticalStock",  criticalStock);
        stats.put("lowStock",       lowStock);
        stats.put("expired",        expiredList);
        stats.put("expiringSoon",   expiringSoon);
        stats.put("expiringMonth",  expiringMonth);

        stats.put("totalSuppliers",  supplierRepository.count());
        stats.put("activeSuppliers", supplierRepository.findAllByOrderByCompanyNameAsc()
                .stream().filter(s -> "ACTIVE".equals(s.getStatus())).count());

        return stats;
    }

    private double safe(Double v)    { return v != null ? v : 0.0; }
    private long   safeLong(Long v)  { return v != null ? v : 0L; }
    private double round2(double v)  { return Math.round(v * 100.0) / 100.0; }

    private Map<String, Object> stockMap(Product p, double qty) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",       p.getId());
        m.put("name",     p.getProductName());
        m.put("qty",      qty);
        m.put("minQty",   p.getMinimumStockLevel());
        m.put("category", p.getCategory());
        return m;
    }

    private Map<String, Object> expiryMap(Product p, long daysLeft) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",       p.getId());
        m.put("name",     p.getProductName());
        m.put("expiry",   p.getExpiryDate() != null ? p.getExpiryDate().toString() : null);
        m.put("daysLeft", daysLeft);
        return m;
    }
}
