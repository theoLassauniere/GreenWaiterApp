package fr.green.dining.controller;

import fr.green.dining.dto.PreparationDto;
import fr.green.dining.dto.PreparedItemDto;
import fr.green.dining.dto.SimpleOrderDto;
import fr.green.dining.enums.PreparationStatus;
import fr.green.dining.services.OrderService;
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
