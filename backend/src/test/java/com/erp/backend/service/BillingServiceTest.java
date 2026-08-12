package com.erp.backend.service;

import com.erp.backend.dto.BillRequest;
import com.erp.backend.model.Bill;
import com.erp.backend.model.Product;
import com.erp.backend.repository.BillRepository;
import com.erp.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BillingServiceTest {

    private BillingService billingService;

    @Mock
    private BillRepository billRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        billingService = new BillingService(billRepository, productRepository, customerRepository);
    }

    @Test
    void testSaveBillSuccessfully() {
        BillRequest request = new BillRequest();
        request.setCashierName("John Doe");
        request.setReceivedAmount(100.0);

        BillRequest.BillItemRequest itemReq = new BillRequest.BillItemRequest();
        itemReq.setProductId(1L);
        itemReq.setProductName("Test Product");
        itemReq.setUnitPrice(10.0);
        itemReq.setQuantity(5);
        itemReq.setDiscountPercentage(10.0); // 10% discount
        request.setItems(Collections.singletonList(itemReq));

        Product product = new Product();
        product.setId(1L);
        product.setProductName("Test Product");
        product.setStockQuantity(10.0);
        product.setMinimumStockLevel(2.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> {
            Bill saved = invocation.getArgument(0);
            saved.setId(123L);
            return saved;
        });

        Map<String, Object> result = billingService.saveBill(request);

        assertNotNull(result);
        assertEquals(123L, result.get("id"));
        assertEquals("John Doe", result.get("cashierName"));
        assertEquals(50.0, result.get("subtotal"));
        assertEquals(5.0, result.get("discountAmount"));
        assertEquals(45.0, result.get("totalAmount"));
        assertEquals(100.0, result.get("receivedAmount"));
        assertEquals(55.0, result.get("balance"));
        assertNotNull(result.get("createdAt"));

        assertEquals(5.0, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);

        // Verify low stock warning is empty since stock is 5.0 and min is 2.0
        List<?> warnings = (List<?>) result.get("lowStockWarnings");
        assertTrue(warnings.isEmpty());
    }

    @Test
    void testSaveBillLowStockWarning() {
        BillRequest request = new BillRequest();
        request.setCashierName("Jane");
        request.setReceivedAmount(50.0);

        BillRequest.BillItemRequest itemReq = new BillRequest.BillItemRequest();
        itemReq.setProductId(1L);
        itemReq.setProductName("Low Stock Item");
        itemReq.setUnitPrice(20.0);
        itemReq.setQuantity(9);
        itemReq.setDiscountPercentage(0.0);
        request.setItems(Collections.singletonList(itemReq));

        Product product = new Product();
        product.setId(1L);
        product.setProductName("Low Stock Item");
        product.setStockQuantity(10.0);
        product.setMinimumStockLevel(5.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> {
            Bill saved = invocation.getArgument(0);
            saved.setId(124L);
            return saved;
        });

        Map<String, Object> result = billingService.saveBill(request);

        assertEquals(1.0, product.getStockQuantity()); // 10 - 9 = 1
        List<?> warnings = (List<?>) result.get("lowStockWarnings");
        assertEquals(1, warnings.size());
        assertTrue(warnings.get(0).toString().contains("Warning: Stock for 'Low Stock Item' is low"));
    }
}
