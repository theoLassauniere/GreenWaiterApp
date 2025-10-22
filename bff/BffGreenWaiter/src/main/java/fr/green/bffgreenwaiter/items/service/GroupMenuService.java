package fr.green.bffgreenwaiter.items.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.green.bffgreenwaiter.items.model.GroupMenu;
import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.model.ItemRaw;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class GroupMenuService {


    private final String menuFileName;
    private final MenuApiClient menuApiClient;

    private GroupMenu menuCache;

    public GroupMenuService(
            MenuApiClient menuApiClient,
            @Value("${menu.file.name}") String menuFileName
    ) {
        this.menuApiClient = menuApiClient;
        this.menuFileName = menuFileName;
    }

    @PostConstruct
    public void init() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream(menuFileName);
        menuCache = mapper.readValue(is, new TypeReference<>() {
        });
        List<Item> itemNames = menuCache.getItemsByCategory().values().stream().flatMap(List::stream).toList();
        assignIdsToItems(itemNames);
    }

    public GroupMenu getMenu() {
        return menuCache;
    }

    private void assignIdsToItems(List<Item> items) {
        List<ItemRaw> menuCache = menuApiClient.getCachedItems().isEmpty() ?
                menuApiClient.fetchItems() : menuApiClient.getCachedItems();
        for (Item item : items) {
            item.set_id(menuCache.stream()
                    .filter(dbItem -> dbItem.getShortName().equalsIgnoreCase(item.getShortName()))
                    .findFirst()
                    .map(ItemRaw::get_id)
                    .orElse(null));
        }
    }
}
