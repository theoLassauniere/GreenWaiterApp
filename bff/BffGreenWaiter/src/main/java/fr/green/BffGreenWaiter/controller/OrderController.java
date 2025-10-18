package fr.green.BffGreenWaiter.controller;

import fr.green.BffGreenWaiter.service.order.OrderService;
import fr.green.BffGreenWaiter.dto.order.OrderItemDTO;
import fr.green.BffGreenWaiter.dto.order.ShortOrderDto;
import fr.green.BffGreenWaiter.dto.order.SimpleOrderDto;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dining")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/tableOrders")
    public List<SimpleOrderDto> getOrders() {
        return orderService.getOrders();
    }

    @GetMapping("/tableOrders/{tableNumber}")
    public String getOrderForTable(@PathVariable int tableNumber) {
        return orderService.getOrderForTable(tableNumber);
    }

    @PostMapping("/tableOrders/newOrder")
    public ResponseEntity<?> createNewOrder(@RequestBody ShortOrderDto order) {
        try {
            var preparations = orderService.createAndStartPreparation(order);
            return ResponseEntity.ok(preparations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/finishPreparation")
    public ResponseEntity<?> finishPreparation(@RequestBody List<Map<String, Object>> preparations) {
        try {
            var result = orderService.finishPreparation(preparations);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tableOrders/items/{tableNumber}")
    public List<OrderItemDTO> getOrderItemsForTable(@PathVariable int tableNumber) {
        return orderService.getOrderItems(tableNumber);
    }

    @PostMapping("/tableOrders/bill/{tableNumber}")
    public ResponseEntity<?> billOrderForTable(@PathVariable int tableNumber) {
        try {
            var order = orderService.billOrder(tableNumber);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/preparations/{preparationId}/takenToTable")
    public ResponseEntity<?> markPreparationAsServed(@PathVariable String preparationId) {
        try {
            var result = orderService.markPreparationAsServed(preparationId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
        return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
    }
    }
}
