package fr.green.BffGreenWaiter.items.service;

import fr.green.BffGreenWaiter.allergen.service.AllergenService;
import fr.green.BffGreenWaiter.items.model.Item;
import fr.green.BffGreenWaiter.items.model.ItemRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final AllergenService allergenService;
    private final MenuService menuService;

    public List<Item> getItemsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return Collections.emptyList();
        }
        String searched = category.trim().toUpperCase(Locale.ROOT);

        return menuService.fetchItems()
                .stream()
                .filter(db -> db.getCategory() != null &&
                        db.getCategory().trim().equalsIgnoreCase(searched))
                .map(this::toItem)
                .map(item -> {
                    item.setAllergens(allergenService.getAllergensByName(item.getShortName()));
                    return item;
                })
                .toList();
    }

    private Item toItem(ItemRaw db) {
        Item item = new Item();
        item.set_id(db.get_id());
        item.setFullName(db.getFullName());
        item.setShortName(db.getShortName());
        item.setPrice(db.getPrice());
        item.setCategory(db.getCategory());
        item.setImage(db.getImage());
        return item;
    }
}
