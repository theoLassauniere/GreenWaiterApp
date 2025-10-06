package fr.green.kitchen.controller;

import fr.green.kitchen.dto.PreparationDto;
import fr.green.kitchen.dto.PreparedItemDto;
import fr.green.kitchen.enums.PreparationStatus;
import fr.green.kitchen.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kitchen")
public class OrdersController {
    private OrderService orderService;

    @PostMapping("/preparations")
    public PreparedItemDto createNewOrder(@RequestBody PreparationDto preparation) {
        return orderService.createNewOrder(preparation);
    }

    @GetMapping("/preparations")
    public String getReadyOrders(@RequestParam("state") String state) {
        PreparationStatus status = PreparationStatus.fromValue(state);
        return orderService.getReadyOrders(status);
    }
}
