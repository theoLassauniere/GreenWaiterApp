package fr.green.bffgreenwaiter.orders.controller;

import fr.green.bffgreenwaiter.orders.dto.OrderItemDto;
import fr.green.bffgreenwaiter.orders.dto.ShortOrderDto;
import fr.green.bffgreenwaiter.orders.dto.SimpleOrderDto;
import fr.green.bffgreenwaiter.orders.services.OrderServiceFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dining")
public class OrderController {
    private final OrderServiceFacade orderServiceFacade;

    @GetMapping("/tableOrders")
    public List<SimpleOrderDto> getOrders() {
        return orderServiceFacade.getOrders();
    }

    @GetMapping("/tableOrders/{tableNumber}")
    public String getOrderForTable(@PathVariable int tableNumber) {
        return orderServiceFacade.getOrderForTable(tableNumber);
    }

    @PostMapping("/tableOrders/newOrder")
    public ResponseEntity<?> createNewOrder(@RequestBody ShortOrderDto order) {
        try {
            var preparations = orderServiceFacade.createAndStartPreparation(order);
            return ResponseEntity.ok(preparations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/tableOrders/newOrder/{groupOrderId}")
    public ResponseEntity<?> createNewOrder(@RequestBody ShortOrderDto order, @PathVariable int groupOrderId) {
        try {
            var preparations = orderServiceFacade.createAndStartPreparationOrder(order, groupOrderId);
            return ResponseEntity.ok(preparations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/finishPreparation")
    public ResponseEntity<?> finishPreparation(@RequestBody List<Map<String, Object>> preparations) {
        try {
            var result = orderServiceFacade.finishPreparation(preparations);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tableOrders/items/{tableNumber}")
    public List<OrderItemDto> getOrderItemsForTable(@PathVariable int tableNumber) {
        return orderServiceFacade.getOrderItems(tableNumber);
    }

    @PostMapping("/tableOrders/bill/{tableNumber}")
    public ResponseEntity<?> billOrderForTable(@PathVariable int tableNumber) {
        try {
            var order = orderServiceFacade.billOrder(tableNumber);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/preparations/{preparationId}/takenToTable")
    public ResponseEntity<?> markPreparationAsServed(@PathVariable String preparationId) {
        try {
            var result = orderServiceFacade.markPreparationAsServed(preparationId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
