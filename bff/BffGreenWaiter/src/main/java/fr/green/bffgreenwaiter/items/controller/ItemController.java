package fr.green.bffgreenwaiter.items.controller;

import fr.green.bffgreenwaiter.items.model.GroupMenu;
import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.service.GroupMenuService;
import fr.green.bffgreenwaiter.items.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final GroupMenuService groupMenuService;

    @GetMapping("/getItems/{category}")
    public List<Item> getItemsByCategory(@PathVariable String category) {
        return itemService.getItemsByCategory(category);
    }

    @GetMapping("/getMenu/{groupId}")
    public GroupMenu getMenuByGroupId(@PathVariable int groupId) {
        return groupMenuService.getMenuByGroupId(groupId);
    }
}
