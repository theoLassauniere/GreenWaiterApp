package fr.green.kitchen.controller;

import fr.green.kitchen.dto.PreparationDto;
import fr.green.kitchen.enums.PreparationStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kitchen")
public class OrdersController {

    @PostMapping("/preparations")
    public String createNewOrder(@RequestBody PreparationDto preparation) {
        return "fetched createNewOrder";
    }

    @GetMapping("/preparations")
    public String getReadyOrders(@RequestParam("state") String state) {
        PreparationStatus status = PreparationStatus.fromValue(state);
        return "fetched listTables with state: " + status;
    }

}
