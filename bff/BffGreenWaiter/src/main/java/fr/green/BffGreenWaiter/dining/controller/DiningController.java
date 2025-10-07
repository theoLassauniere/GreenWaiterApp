package fr.green.BffGreenWaiter.dining.controller;

import fr.green.BffGreenWaiter.dining.dto.ShortOrderDto;
import fr.green.BffGreenWaiter.dining.dto.SimpleOrderDto;
import fr.green.BffGreenWaiter.dining.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dining")
public class DiningController {
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
    public void createNewOrder(@RequestBody ShortOrderDto order) {
        orderService.createNewOrderFull(order);
    }
}
