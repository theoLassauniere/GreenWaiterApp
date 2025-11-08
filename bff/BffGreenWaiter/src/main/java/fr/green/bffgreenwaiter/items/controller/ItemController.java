package fr.green.bffgreenwaiter.items.controller;

import fr.green.bffgreenwaiter.items.model.ItemWithAllergens;
import fr.green.bffgreenwaiter.items.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/getItems/{category}")
    public List<ItemWithAllergens> getItemsByCategory(@PathVariable String category) {
        return itemService.getItemsByCategory(category);
    }
}
