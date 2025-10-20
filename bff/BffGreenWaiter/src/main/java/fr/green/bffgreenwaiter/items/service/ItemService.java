package fr.green.bffgreenwaiter.items.service;

import fr.green.bffgreenwaiter.items.mapper.ItemMapper;
import fr.green.bffgreenwaiter.items.model.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final AllergenService allergenService;
    private final MenuApiClient menuApiClient;
    private final ItemMapper itemMapper;

    public List<Item> getItemsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return Collections.emptyList();
        }
        String searched = category.trim().toUpperCase(Locale.ROOT);

        return menuApiClient.fetchItems()
                .stream()
                .filter(db -> db.getCategory() != null &&
                        db.getCategory().trim().equalsIgnoreCase(searched))
                .map(itemMapper::toItem)
                .peek(item -> item.setAllergens(allergenService.getAllergensByName(item.getShortName())))
                .toList();
    }
}
