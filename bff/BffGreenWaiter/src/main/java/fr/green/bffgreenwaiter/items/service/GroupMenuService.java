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
import java.util.ArrayList;
import java.util.List;

@Service
public class GroupMenuService {
    private final String menuFileName;
    private final MenuApiClient menuApiClient;
    private final AllergenService allergenService;

    private List<GroupMenu> menusCache;

    public GroupMenuService(
            @Value("${menu.file.name}") String menuFileName,
            MenuApiClient menuApiClient,
            AllergenService allergenService
    ) {
        this.menuApiClient = menuApiClient;
        this.allergenService = allergenService;
        this.menuFileName = menuFileName;
    }

    @PostConstruct
    public void init() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream(menuFileName);
        menusCache = mapper.readValue(is, new TypeReference<>() {
        });
        menusCache.forEach(menu -> {
            menu.setMenuCount(0);
            List<Item> itemNames = menu.getItemsByCategory()
                    .values().stream().flatMap(List::stream).toList();
            fillItem(itemNames);
        });
    }

    public List<GroupMenu> getMenus() {
        return new ArrayList<>(menusCache);
    }

    public GroupMenu getMenuByName(String name) {
        return menusCache.stream()
                .filter(menu -> menu.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    public GroupMenu getMenuByGroupId(int groupId) {
        return menusCache.stream()
                .filter(menu -> menu.getGroupId() == groupId)
                .findFirst()
                .orElse(null);
    }

    private void fillItem(List<Item> items) {
        List<ItemRaw> itemsFromApi = menuApiClient.getCachedItems().isEmpty() ?
                menuApiClient.fetchItems() : menuApiClient.getCachedItems();
        for (Item item : items) {
            itemsFromApi.stream()
                    .filter(dbItem -> dbItem.getShortName().equalsIgnoreCase(item.getShortName()))
                    .findFirst()
                    .ifPresent(dbItem -> {
                        item.set_id(dbItem.get_id());
                        item.setFullName(dbItem.getFullName());
                        item.setPrice(dbItem.getPrice());
                        item.setCategory(dbItem.getCategory());
                        item.setImage(dbItem.getImage());
                        item.setAllergens(allergenService.getAllergensByName(dbItem.getShortName()));
                    });
        }
    }
}
