package com.erp.backend.service;

import com.erp.backend.dto.BillRequest;
import com.erp.backend.model.Bill;
import com.erp.backend.model.BillItem;
import com.erp.backend.model.Product;
import com.erp.backend.model.Customer;
import com.erp.backend.repository.BillRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.CustomerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public BillingService(BillRepository billRepository, ProductRepository productRepository, CustomerRepository customerRepository) {
        this.billRepository = billRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Map<String, Object> saveBill(BillRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Bill must contain at least one item.");
        }

        Bill bill = new Bill();
        bill.setCashierName(request.getCashierName() != null ? request.getCashierName() : "Cashier");
        bill.setCustomerId(request.getCustomerId());
        bill.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : "Walk-in Customer");
        bill.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CASH");
        bill.setReceivedAmount(request.getReceivedAmount() != null ? request.getReceivedAmount() : 0.0);
        bill.setCreatedAt(LocalDateTime.now());
        bill.setStatus("COMPLETED");

        double subtotal = 0.0;
        double discountAmount = 0.0;
        double investment = 0.0;
        List<String> lowStockWarnings = new ArrayList<>();

        for (BillRequest.BillItemRequest itemReq : request.getItems()) {
            double lineGross = (itemReq.getUnitPrice() != null ? itemReq.getUnitPrice() : 0.0)
                    * (itemReq.getQuantity() != null ? itemReq.getQuantity() : 0);
            double discPct = itemReq.getDiscountPercentage() != null ? itemReq.getDiscountPercentage() : 0.0;
            subtotal += lineGross;
            discountAmount += (lineGross * discPct) / 100.0;
        }

        double totalAmount = subtotal - discountAmount;
        double received = request.getReceivedAmount() != null ? request.getReceivedAmount() : 0.0;

        if (received <= 0) {
            throw new IllegalArgumentException("Cash received cannot be zero. The customer must pay before completing the bill.");
        }
        if (received < totalAmount) {
            throw new IllegalArgumentException(
                    String.format("Insufficient payment. Total is LKR %.2f but only LKR %.2f received.", totalAmount, received));
        }

        subtotal = 0.0;
        discountAmount = 0.0;

        for (BillRequest.BillItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductName()));

            double currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0.0;
            double quantityToDeduct = itemReq.getQuantity() != null ? itemReq.getQuantity() : 0.0;
            double updatedStock = currentStock - quantityToDeduct;
            product.setStockQuantity(updatedStock);
            productRepository.save(product);

            double minStock = product.getMinimumStockLevel() != null ? product.getMinimumStockLevel() : 0.0;
            if (updatedStock < minStock) {
                lowStockWarnings.add(String.format("Warning: Stock for '%s' is low. Current: %.2f (Min: %.2f)",
                        product.getProductName(), updatedStock, minStock));
            }

            BillItem billItem = new BillItem();
            billItem.setProductId(product.getId());
            billItem.setProductName(product.getProductName());
            billItem.setCategory(product.getCategory());
            billItem.setUnitPrice(itemReq.getUnitPrice());
            
            double buyPrice = product.getBuyingPrice() != null ? product.getBuyingPrice() : 0.0;
            billItem.setBuyingPrice(buyPrice);
            billItem.setQuantity(itemReq.getQuantity());
            billItem.setDiscountPercentage(itemReq.getDiscountPercentage() != null ? itemReq.getDiscountPercentage() : 0.0);

            double lineGross = billItem.getUnitPrice() * billItem.getQuantity();
            subtotal += lineGross;
            discountAmount += (lineGross * billItem.getDiscountPercentage()) / 100.0;
            investment += buyPrice * billItem.getQuantity();

            bill.addItem(billItem);
        }

        bill.setSubtotal(subtotal);
        bill.setDiscountAmount(discountAmount);
        double netTotal = subtotal - discountAmount;
        bill.setTotalAmount(netTotal);
        bill.setBalance(received - netTotal);
        bill.setInvestment(investment);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
        bill.setBillNumber("INV-" + bill.getCreatedAt().format(formatter));

        Bill savedBill = billRepository.save(bill);

        if (request.getCustomerId() != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(customer -> {
                customer.addPointsForPurchase(netTotal);
                customerRepository.save(customer);
            });
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedBill.getId());
        response.put("billNumber", savedBill.getBillNumber());
        response.put("cashierName", savedBill.getCashierName());
        response.put("createdAt", savedBill.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        response.put("subtotal", savedBill.getSubtotal());
        response.put("discountAmount", savedBill.getDiscountAmount());
        response.put("totalAmount", savedBill.getTotalAmount());
        response.put("receivedAmount", savedBill.getReceivedAmount());
        response.put("balance", savedBill.getBalance());
        response.put("lowStockWarnings", lowStockWarnings);

        return response;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAllByOrderByCreatedAtDesc();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + id));
    }

    public byte[] generateBillPdf(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + billId));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        document.setMargins(36, 36, 36, 36);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        Paragraph title = new Paragraph("SMARTSTORE ERP")
                .setFontSize(22)
                .setBold()
                .setFontColor(ColorConstants.DARK_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        Paragraph subtitle = new Paragraph("Official Invoice / Customer Bill")
                .setFontSize(10)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15);
        document.add(subtitle);

        document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(15));

        Table metaTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        metaTable.setWidth(UnitValue.createPercentValue(100));
        metaTable.setMarginBottom(20);

        metaTable.addCell(new Cell().add(new Paragraph("Bill Number: " + bill.getBillNumber()).setBold()).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        metaTable.addCell(new Cell().add(new Paragraph("Date & Time: " + bill.getCreatedAt().format(formatter))).setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        metaTable.addCell(new Cell().add(new Paragraph("Cashier: " + bill.getCashierName())).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        metaTable.addCell(new Cell().add(new Paragraph("Status: Paid")).setTextAlignment(TextAlignment.RIGHT).setFontColor(ColorConstants.GREEN).setBold().setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        
        document.add(metaTable);

        float[] columnWidths = {3, 1, 2, 1, 2};
        Table itemTable = new Table(UnitValue.createPercentArray(columnWidths));
        itemTable.setWidth(UnitValue.createPercentValue(100));
        itemTable.setMarginBottom(20);

        itemTable.addHeaderCell(new Cell().add(new Paragraph("Item Name").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Qty").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY).setTextAlignment(TextAlignment.RIGHT));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Unit Price").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY).setTextAlignment(TextAlignment.RIGHT));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Disc %").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY).setTextAlignment(TextAlignment.RIGHT));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY).setTextAlignment(TextAlignment.RIGHT));

        for (BillItem item : bill.getItems()) {
            double totalLinePrice = item.getUnitPrice() * item.getQuantity();
            double finalLinePrice = totalLinePrice - (totalLinePrice * item.getDiscountPercentage() / 100.0);

            itemTable.addCell(new Cell().add(new Paragraph(item.getProductName())));
            itemTable.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity()))).setTextAlignment(TextAlignment.RIGHT));
            itemTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", item.getUnitPrice()))).setTextAlignment(TextAlignment.RIGHT));
            itemTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", item.getDiscountPercentage()))).setTextAlignment(TextAlignment.RIGHT));
            itemTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", finalLinePrice))).setTextAlignment(TextAlignment.RIGHT));
        }

        document.add(itemTable);

        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        summaryTable.setWidth(UnitValue.createPercentValue(50));
        summaryTable.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.RIGHT);
        summaryTable.setMarginBottom(30);

        summaryTable.addCell(new Cell().add(new Paragraph("Subtotal:")).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        summaryTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", bill.getSubtotal()))).setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

        summaryTable.addCell(new Cell().add(new Paragraph("Discount:")).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        summaryTable.addCell(new Cell().add(new Paragraph(String.format("- LKR %.2f", bill.getDiscountAmount()))).setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

        summaryTable.addCell(new Cell().add(new Paragraph("Total Amount:")).setBold().setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        summaryTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", bill.getTotalAmount()))).setBold().setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

        summaryTable.addCell(new Cell().add(new Paragraph("Cash Received:")).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        summaryTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", bill.getReceivedAmount()))).setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

        summaryTable.addCell(new Cell().add(new Paragraph("Balance Change:")).setBold().setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        summaryTable.addCell(new Cell().add(new Paragraph(String.format("LKR %.2f", bill.getBalance()))).setBold().setTextAlignment(TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

        document.add(summaryTable);

        document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(10));
        
        Paragraph thankYou = new Paragraph("Thank you for shopping at SmartStore! Please visit us again.")
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);
        document.add(thankYou);

        document.close();
        return baos.toByteArray();
    }
}
