package fr.green.BffGreenWaiter.controller;

import fr.green.BffGreenWaiter.model.Item;
import fr.green.BffGreenWaiter.service.item.ItemService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/getItems/{category}")
    public List<Item> getItemsByCategory(@PathVariable String category) {
        return itemService.getItemsByCategory(category);
    }
}
