package fr.green.bffgreenwaiter.orders.services;

import fr.green.bffgreenwaiter.items.enums.FoodCategory;
import fr.green.bffgreenwaiter.items.model.GroupMenu;
import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.service.GroupMenuService;
import fr.green.bffgreenwaiter.items.service.ItemService;
import fr.green.bffgreenwaiter.orders.dto.MenuItemToOrderDto;
import fr.green.bffgreenwaiter.orders.dto.ShortGroupOrderDto;
import fr.green.bffgreenwaiter.orders.dto.ShortOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderPreparationService {

    private final WebClient.Builder webClientBuilder;
    private final OrderQueryService orderQueryService;
    private final GroupMenuService groupMenuService;
    private final ItemService itemService;

    @Value("${tableOrders.service.url}")
    private String tablesUrl;

    @Value("${kitchen.service.url}")
    private String kitchenBaseUrl;

    public List<Map<String, Object>> createAndStartPreparationOrder(ShortGroupOrderDto groupOrder, int groupId) {
        GroupMenu menu = groupMenuService.getMenuByGroupId(groupId);
        if (menu == null) {
            throw new RuntimeException("Menu not found: " + groupId);
        }

        int newMainItemCount = countMainItem(groupOrder.getGroupMenuItems());
        int totalMainItemCount = menu.getMenuCount() + newMainItemCount;

        if (totalMainItemCount > menu.getMaxMembers()) {
            int leftOver = totalMainItemCount - menu.getMaxMembers();
            List<MenuItemToOrderDto> extraItems = redistributeExcessItems(groupOrder, menu, leftOver);
            groupOrder.getGroupMenuExtras().addAll(extraItems);
        }

        menu.setMenuCount(menu.getMenuCount() + Math.min(newMainItemCount, menu.getMaxMembers() - menu.getMenuCount()));

        var extendedItems = new ArrayList<>(groupOrder.getGroupMenuItems());
        extendedItems.addAll(groupOrder.getGroupMenuExtras());

        ShortOrderDto finalOrder = new ShortOrderDto(
                groupOrder.getTableNumber(),
                extendedItems,
                groupOrder.getBilled());
        return createAndStartPreparation(finalOrder);
    }

    private List<MenuItemToOrderDto> redistributeExcessItems(ShortGroupOrderDto groupOrder, GroupMenu menu, int leftOver) {
        List<MenuItemToOrderDto> menuItems = groupOrder.getGroupMenuItems();
        List<MenuItemToOrderDto> extraItems = new ArrayList<>();

        // Récupère les catégories du menu
        Map<FoodCategory, List<Item>> itemsByCategory = menu.getItemsByCategory();

        for (FoodCategory category : itemsByCategory.keySet()) {
            int toRemove = leftOver;

            // Parcourt les items en ordre inverse
            for (int i = menuItems.size() - 1; i >= 0 && toRemove > 0; i--) {
                MenuItemToOrderDto item = menuItems.get(i);
                Item menuItem = itemService.getItemsByID(item.getMenuItemId());

                if (FoodCategory.fromString(menuItem.getCategory()) == category) {
                    int removed = Math.min(item.getHowMany(), toRemove);

                    if (removed == item.getHowMany()) {
                        menuItems.remove(i);
                    } else {
                        item.setHowMany(item.getHowMany() - removed);
                    }

                    MenuItemToOrderDto extraItem = new MenuItemToOrderDto();
                    extraItem.setMenuItemId(item.getMenuItemId());
                    extraItem.setHowMany(removed);
                    extraItems.add(extraItem);

                    toRemove -= removed;
                }
            }
        }

        return extraItems;
    }

    public List<Map<String, Object>> createAndStartPreparation(ShortOrderDto order) {
        WebClient webClient = webClientBuilder.build();

        String orderId = orderQueryService.getOrderForTable(order.getTableNumber());
        String orderUrl = tablesUrl + "/" + orderId;
        String prepareUrl = orderUrl + "/prepare";

        // Envoi des items à la commande
        for (MenuItemToOrderDto item : order.getMenuItems()) {
            webClient.post()
                    .uri(orderUrl)
                    .bodyValue(item)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }

        // Lancement de la préparation
        List<Map<String, Object>> preparations = webClient.post()
                .uri(prepareUrl)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (preparations == null || preparations.isEmpty()) {
            throw new RuntimeException("Aucune préparation créée");
        }

        // Enrichissement avec le numéro de table
        for (Map<String, Object> prep : preparations) {
            prep.put("tableNumber", order.getTableNumber());
        }

        // Démarrage de chaque item
        startPreparedItems(preparations);
        return preparations;
    }

    public int countMainItem(List<MenuItemToOrderDto> items) {
        int count = 0;
        for (MenuItemToOrderDto item : items) {
            Item menuItem = itemService.getItemsByID(item.getMenuItemId());
            if (FoodCategory.fromString(menuItem.getCategory()) == FoodCategory.MAIN) {
                count += item.getHowMany();
            }
        }
        return count;
    }


    public void startPreparedItems(List<Map<String, Object>> preparations) {
        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");
            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                webClientBuilder.build()
                        .post()
                        .uri(kitchenBaseUrl + "/preparedItems/" + itemId + "/start")
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            }
        }
    }

    public List<Map<String, Object>> finishPreparation(List<Map<String, Object>> preparations) {
        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");
            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                webClientBuilder.build()
                        .post()
                        .uri(kitchenBaseUrl + "/preparedItems/" + itemId + "/finish")
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            }
        }
        return preparations;
    }


}
