package com.erp.backend.config;

import com.erp.backend.model.*;
import com.erp.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final BillRepository billRepository;

    public DatabaseSeeder(ProductRepository productRepository,
                          InventoryRepository inventoryRepository,
                          SupplierRepository supplierRepository,
                          CustomerRepository customerRepository,
                          BillRepository billRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.customerRepository = customerRepository;
        this.billRepository = billRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Clearing old tables for a clean seed of realistic business data...");
        billRepository.deleteAll();
        productRepository.deleteAll();
        supplierRepository.deleteAll();
        customerRepository.deleteAll();
        inventoryRepository.deleteAll();
        
        billRepository.flush();
        productRepository.flush();
        supplierRepository.flush();
        customerRepository.flush();
        inventoryRepository.flush();

        System.out.println("Seeding 15 realistic suppliers...");
        String[][] supplierDefs = {
            {"SUP-001", "Fresh Farm Distributors", "Suresh Perera", "0771234501", "info@freshfarm.lk", "A23, Economic Center, Dambulla", "Net 30", "Fresh Vegetables", "ACTIVE"},
            {"SUP-002", "Green Dairy Lanka", "Nimal Silva", "0771234502", "supply@greendairy.lk", "45, Dairy Farm Road, Ambewela", "Cash on Delivery", "Dairy", "ACTIVE"},
            {"SUP-003", "Sunrise Bakery Suppliers", "Priya Kumari", "0771234503", "orders@sunrise.lk", "102, Galle Road, Colombo 03", "Net 15", "Bakery", "ACTIVE"},
            {"SUP-004", "Ocean Seafood Lanka", "Kamal Perera", "0771234504", "fish@oceanseafood.lk", "Harbour View Road, Negombo", "Net 30", "Seafood", "ACTIVE"},
            {"SUP-005", "ABC Beverage Suppliers", "Ruwan Bandara", "0771234505", "sales@abcbev.lk", "88, Kandy Road, Kelaniya", "Net 45", "Beverages", "ACTIVE"},
            {"SUP-006", "Golden Rice Traders", "Dilshan Jayawardena", "0771234506", "trade@goldenrice.lk", "Economic Zone, Polonnaruwa", "Net 30", "Grocery", "ACTIVE"},
            {"SUP-007", "Fresh Fruit Imports", "Amara Fernando", "0771234507", "import@freshfruit.lk", "12, Port Access Road, Colombo 13", "Cash on Delivery", "Imported Fruits", "ACTIVE"},
            {"SUP-008", "Sweet Choice Confectionery", "Sachini Rathnayake", "0771234508", "info@sweetchoice.lk", "55, Industrial Estate, Kandy", "Net 15", "Snacks", "ACTIVE"},
            {"SUP-009", "Home Essentials Pvt Ltd", "Tharaka Wijesinghe", "0771234509", "service@homeessentials.lk", "204, High Level Road, Maharagama", "Net 30", "Household", "ACTIVE"},
            {"SUP-010", "Health Care Suppliers", "Anitha Kumar", "0771234510", "orders@healthcare.lk", "77, Park Street, Colombo 02", "Net 30", "Toiletries", "ACTIVE"},
            {"SUP-011", "Meat & Poultry Express", "Mahesh Fernando", "0771234511", "meat@poultryexpress.lk", "14, Bypass Road, Kurunegala", "Cash on Delivery", "Meat", "ACTIVE"},
            {"SUP-012", "Spice World SL", "Sunil Shantha", "0771234512", "spices@spiceworld.lk", "Spice Garden, Matale", "Net 30", "Grocery", "ACTIVE"},
            {"SUP-013", "Grain & Pulse Distributors", "Bandara Herath", "0771234513", "pulse@grainsl.lk", "90, Anuradhapura Road", "Net 15", "Grocery", "ACTIVE"},
            {"SUP-014", "Snax & Co", "Nilmini Alwis", "0771234514", "sales@snaxco.lk", "Industrial Zone, Gampaha", "Net 30", "Snacks", "ACTIVE"},
            {"SUP-015", "Clean & Shine Products", "Lasitha Silva", "0771234515", "clean@shinepro.lk", "34, Factory Lane, Ratmalana", "Net 45", "Household", "ACTIVE"}
        };

        for (String[] def : supplierDefs) {
            Supplier s = new Supplier();
            s.setSupplierCode(def[0]);
            s.setCompanyName(def[1]);
            s.setContactPerson(def[2]);
            s.setPhone(def[3]);
            s.setEmail(def[4]);
            s.setAddress(def[5]);
            s.setPaymentTerms(def[6]);
            s.setCategory(def[7]);
            s.setStatus(def[8]);
            s.setTotalPurchaseValue(0.0);
            supplierRepository.save(s);
        }

        List<Supplier> suppliers = supplierRepository.findAll();

        System.out.println("Seeding products linked to suppliers...");
        Object[][] productDefs = {
            {"Basmati Rice 5kg", "Grocery", "Bags", 85.0, 15.0, 1250.0, 1590.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), "SUP-006", "4001234567890", "Kurakkan", "B-9981"},
            {"Nestlé Milo 400g", "Beverages", "Packets", 42.0, 25.0, 680.0, 850.0, 0.0, LocalDate.now().minusMonths(2), LocalDate.now().plusYears(1), "SUP-005", "4009876543210", "Nestle", "B-9982"},
            {"Sunlight Dishwash 1L", "Household", "Bottles", 8.0, 20.0, 185.0, 240.0, 0.0, LocalDate.now().minusMonths(3), LocalDate.now().plusYears(2), "SUP-015", "4005551234567", "Sunlight", "B-9983"},
            {"Anchor Milk 1L", "Dairy", "Cartons", 3.0, 15.0, 310.0, 390.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusDays(5), "SUP-002", "4007771234567", "Anchor", "B-9984"},
            {"Signal Toothpaste", "Toiletries", "Tubes", 0.0, 10.0, 125.0, 165.0, 0.0, LocalDate.now().minusMonths(4), LocalDate.now().plusYears(2), "SUP-010", "4003331234567", "Signal", "B-9985"},
            {"Maggi Noodles 12pk", "Grocery", "Packets", 56.0, 20.0, 390.0, 490.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(6), "SUP-014", "4002221234567", "Maggi", "B-9986"},
            {"Coca-Cola 1.5L", "Beverages", "Bottles", 28.0, 12.0, 220.0, 280.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(8), "SUP-005", "4001114567890", "Coke", "B-9987"},
            {"Sunflower Oil 1L", "Grocery", "Bottles", 2.0, 10.0, 450.0, 560.0, 0.0, LocalDate.now().minusMonths(2), LocalDate.now().plusYears(1), "SUP-009", "4008881234567", "Spar", "B-9988"},
            {"Dettol Soap 75g", "Toiletries", "Bars", 15.0, 20.0, 92.0, 120.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(2), "SUP-010", "4004441234567", "Dettol", "B-9989"},
            {"Anchor Butter 500g", "Dairy", "Tubs", 6.0, 8.0, 680.0, 870.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusDays(10), "SUP-002", "4006661234567", "Anchor", "B-9990"},
            {"Astra Margarine 500g", "Dairy", "Tubs", 45.0, 15.0, 380.0, 480.0, 0.0, LocalDate.now().minusMonths(2), LocalDate.now().minusDays(5), "SUP-002", "4001237654321", "Astra", "B-9991"},
            {"Surf Excel 500g", "Household", "Packets", 90.0, 20.0, 195.0, 250.0, 0.0, LocalDate.now().minusMonths(2), LocalDate.now().plusYears(2), "SUP-015", "4005556789012", "Surf", "B-9992"},
            {"Red Raw Rice 5kg", "Grocery", "Bags", 120.0, 20.0, 950.0, 1150.0, 0.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), "SUP-006", "4001234567001", "Golden Rice", "B-9993"},
            {"Fresh Carrots 1kg", "Grocery", "kg", 35.0, 10.0, 220.0, 310.0, 0.0, LocalDate.now().minusDays(3), LocalDate.now().plusDays(10), "SUP-001", "4001234567002", "Local Farm", "B-9994"},
            {"Fresh Potatoes 1kg", "Grocery", "kg", 60.0, 15.0, 180.0, 260.0, 0.0, LocalDate.now().minusDays(3), LocalDate.now().plusDays(15), "SUP-001", "4001234567003", "Local Farm", "B-9995"}
        };

        for (Object[] def : productDefs) {
            Product p = new Product();
            p.setProductName((String) def[0]);
            p.setCategory((String) def[1]);
            p.setUnitType((String) def[2]);
            p.setStockQuantity((Double) def[3]);
            p.setMinimumStockLevel((Double) def[4]);
            p.setBuyingPrice((Double) def[5]);
            p.setSellingPrice((Double) def[6]);
            p.setDiscountPercentage((Double) def[7]);
            p.setManufacturingDate((LocalDate) def[8]);
            p.setExpiryDate((LocalDate) def[9]);
            p.setBarcode((String) def[11]);
            p.setBrand((String) def[12]);
            p.setBatchNumber((String) def[13]);

            String supCode = (String) def[10];
            suppliers.stream()
                     .filter(s -> supCode.equals(s.getSupplierCode()))
                     .findFirst()
                     .ifPresent(s -> {
                         p.setSupplierId(s.getId());
                         p.setSupplierName(s.getCompanyName());
                     });

            productRepository.save(p);
        }

        System.out.println("Seeding 100 realistic customers...");
        String[] firstNames = {"Ramesh", "Dilani", "Kumari", "Nalin", "Pradeep", "Suneetha", "Tharaka", "Nilmini", "Suresh", "Priya", "Kamal", "Nimal", "Amara", "Ruwan", "Dilshan", "Sachini", "Tharaka", "Anitha", "Mahesh", "Sunil"};
        String[] lastNames = {"Perera", "Silva", "Jayasinghe", "Fernando", "Rathnayake", "Wijesekara", "Gamage", "Bandara", "Gunawardena", "Kumari", "Wijesinghe", "Alwis", "Samarasinghe", "Jayawardena", "Karunaratne", "Senanayake", "Peiris", "Mendis", "Cooray", "Dias"};

        Random rand = new Random(42);
        List<Customer> customerList = new ArrayList<>();

        for (int i = 1; i <= 100; i++) {
            String fn = firstNames[rand.nextInt(firstNames.length)];
            String ln = lastNames[rand.nextInt(lastNames.length)];
            String name = fn + " " + ln;
            String phone = "077" + String.format("%07d", i * 12345 % 10000000);
            String email = fn.toLowerCase() + "." + ln.toLowerCase() + "@gmail.com";
            String address = (rand.nextInt(300) + 1) + ", Galle Road, Colombo " + (rand.nextInt(15) + 1);
            
            Customer c = new Customer();
            c.setName(name);
            c.setPhone(phone);
            c.setEmail(email);
            c.setAddress(address);
            c.setBirthday(LocalDate.now().minusYears(20 + rand.nextInt(40)).minusDays(rand.nextInt(365)));
            c.setRegistrationDate(LocalDateTime.now().minusMonths(rand.nextInt(12)).minusDays(rand.nextInt(28)));
            
            c.setLoyaltyPoints(0);
            c.setTotalSpending(0.0);
            c.setTotalOrders(0);
            c.updateMembership();

            customerList.add(customerRepository.save(c));
        }

        System.out.println("Seeding 150 completed bills over the last 6 months + today...");
        List<Product> products = productRepository.findAll();
        List<Customer> customers = customerRepository.findAll();
        Random brandRand = new Random(101);

        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < 150; i++) {
            Bill bill = new Bill();
            bill.setCashierName(brandRand.nextBoolean() ? "Priya K." : "Amara F.");
            
            if (brandRand.nextDouble() < 0.8 && !customers.isEmpty()) {
                Customer c = customers.get(brandRand.nextInt(customers.size()));
                bill.setCustomerId(c.getId());
                bill.setCustomerName(c.getName());
            } else {
                bill.setCustomerName("Walk-in Customer");
            }

            LocalDateTime billDate;
            double r = brandRand.nextDouble();
            if (r < 0.50) {
                billDate = now.minusMonths(1 + brandRand.nextInt(5)).minusDays(brandRand.nextInt(28)).withHour(8 + brandRand.nextInt(12)).withMinute(brandRand.nextInt(60));
            } else if (r < 0.90) {
                billDate = now.minusDays(1 + brandRand.nextInt(6)).withHour(8 + brandRand.nextInt(12)).withMinute(brandRand.nextInt(60));
            } else {
                billDate = now.withHour(8 + brandRand.nextInt(12)).withMinute(brandRand.nextInt(60));
            }
            bill.setCreatedAt(billDate);

            bill.setPaymentMethod(brandRand.nextBoolean() ? "CASH" : (brandRand.nextBoolean() ? "CARD" : "MOBILE"));
            bill.setStatus("COMPLETED");

            int itemCount = 1 + brandRand.nextInt(5);
            double subtotal = 0;
            double investment = 0;
            double discountAmount = 0;

            for (int j = 0; j < itemCount; j++) {
                Product p = products.get(brandRand.nextInt(products.size()));
                int qty = 1 + brandRand.nextInt(4);

                BillItem item = new BillItem();
                item.setProductId(p.getId());
                item.setProductName(p.getProductName());
                item.setCategory(p.getCategory());
                item.setUnitPrice(p.getSellingPrice());
                item.setBuyingPrice(p.getBuyingPrice());
                item.setQuantity(qty);
                item.setDiscountPercentage(brandRand.nextDouble() < 0.15 ? 10.0 : 0.0);

                double lineGross = item.getUnitPrice() * item.getQuantity();
                double lineDisc = (lineGross * item.getDiscountPercentage()) / 100.0;
                subtotal += lineGross;
                discountAmount += lineDisc;
                investment += item.getBuyingPrice() * qty;

                bill.addItem(item);
            }

            bill.setSubtotal(subtotal);
            bill.setDiscountAmount(discountAmount);
            double total = subtotal - discountAmount;
            bill.setTotalAmount(total);
            bill.setInvestment(investment);
            bill.setReceivedAmount(Math.ceil(total / 100.0) * 100.0);
            bill.setBalance(bill.getReceivedAmount() - total);

            billRepository.save(bill);

            if (bill.getCustomerId() != null) {
                customerRepository.findById(bill.getCustomerId()).ifPresent(c -> {
                    c.addPointsForPurchase(total);
                    customerRepository.save(c);
                });
            }
        }
        System.out.println("Transaction history seeding complete.");

        System.out.println("Seeding database with sample inventory items...");
        inventoryRepository.save(createInventoryItem("Sony WH-1000XM5", "Electronics", 82.0, 10.0, 250.0, 350.0, "Units", "Aisle 4"));
        inventoryRepository.save(createInventoryItem("Nike Air Max 270", "Apparel", 14.0, 15.0, 80.0, 150.0, "Pairs", "Aisle 2"));
        inventoryRepository.save(createInventoryItem("Instant Pot Duo", "Home & Living", 56.0, 10.0, 70.0, 120.0, "Units", "Aisle 6"));
        inventoryRepository.save(createInventoryItem("Apple Watch S9", "Electronics", 3.0, 5.0, 300.0, 399.0, "Units", "Aisle 4"));
        inventoryRepository.save(createInventoryItem("Levi's 501 Jeans", "Apparel", 203.0, 20.0, 40.0, 70.0, "Units", "Aisle 1"));
        System.out.println("Seeding database complete.");
    }

    private InventoryItem createInventoryItem(String name, String category, Double stock, Double minLevel, Double buyingPrice, Double sellingPrice, String unit, String location) {
        InventoryItem item = new InventoryItem();
        item.setItemName(name);
        item.setCategory(category);
        item.setStockQuantity(stock);
        item.setMinimumStockLevel(minLevel);
        item.setBuyingPrice(buyingPrice);
        item.setSellingPrice(sellingPrice);
        item.setUnitType(unit);
        item.setLocation(location);
        return item;
    }
}
