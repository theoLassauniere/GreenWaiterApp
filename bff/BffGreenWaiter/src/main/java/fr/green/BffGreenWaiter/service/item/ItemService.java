package fr.green.BffGreenWaiter.service.item;

import fr.green.BffGreenWaiter.client.MenuClient;
import fr.green.BffGreenWaiter.model.Item;
import fr.green.BffGreenWaiter.model.ItemRaw;
import fr.green.BffGreenWaiter.service.item.AllergenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final AllergenService allergenService;
    private final MenuClient menuClient;

    public List<Item> getItemsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return Collections.emptyList();
        }
        String searched = category.trim().toUpperCase(Locale.ROOT);

        return menuClient.getItems()
                .stream()
                .filter(db -> db.getCategory() != null &&
                        db.getCategory().trim().equalsIgnoreCase(searched))
                .map(db -> {
                    Item item = toItem(db);
                    item.setAllergens(allergenService.getAllergensByName(item.getShortName()));
                    return item;
                })
                .toList();
    }

    public Item getItemById(String id) {
        ItemRaw itemRaw = menuClient.getItemById(id);
        if (itemRaw == null) {
            throw new IllegalStateException("Item non trouvé avec l'ID: " + id);
        }
        Item item = toItem(itemRaw);
        item.setAllergens(allergenService.getAllergensByName(item.getShortName()));
        return item;
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
