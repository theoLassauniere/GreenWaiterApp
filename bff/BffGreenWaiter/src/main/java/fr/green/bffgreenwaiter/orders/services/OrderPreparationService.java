package fr.green.bffgreenwaiter.orders.services;

import fr.green.bffgreenwaiter.items.enums.FoodCategory;
import fr.green.bffgreenwaiter.items.model.GroupMenu;
import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.service.GroupMenuService;
import fr.green.bffgreenwaiter.orders.dto.MenuItemToOrderDto;
import fr.green.bffgreenwaiter.orders.dto.ShortOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderPreparationService {

    private final WebClient.Builder webClientBuilder;
    private final OrderQueryService orderQueryService;
    private final GroupMenuService groupMenuService;

    @Value("${tableOrders.service.url}")
    private String tablesUrl;

    @Value("${kitchen.service.url}")
    private String kitchenBaseUrl;

    public List<Map<String, Object>> createAndStartPreparationOrder(ShortOrderDto order, String menuName) {
        GroupMenu menu = groupMenuService.getMenuByName(menuName);
        if (menu == null) {
            throw new RuntimeException("Menu not found: " + menuName);
        }

        // HashMap pour compter les items par catégorie
        Map<FoodCategory, Integer> itemCountByCategory = countItemsByCategory(order, menu);

        // Calculer combien de menus complets on peut former
        int completeMenus = calculateCompleteMenus(menu, itemCountByCategory);
        // Augmenter le menuCount
        menu.setMenuCount(menu.getMenuCount() + completeMenus);
        return createAndStartPreparation(order);
    }


    // a modifié si y'a plusieurs items par catégorie dans le menu
    private Map<FoodCategory, Integer> countItemsByCategory(ShortOrderDto order, GroupMenu menu) {
        Map<FoodCategory, Integer> itemCountByCategory = new HashMap<>();

        // Vérifier chaque item de la commande
        for (MenuItemToOrderDto orderItem : order.getMenuItems()) {
            // Chercher l'item dans le menu
            Item foundItem = null;
            FoodCategory itemCategory = null;

            for (Map.Entry<FoodCategory, List<Item>> entry : menu.getItemsByCategory().entrySet()) {
                for (Item menuItem : entry.getValue()) {
                    if (menuItem.getShortName().equalsIgnoreCase(orderItem.getMenuItemShortName())) {
                        foundItem = menuItem;
                        itemCategory = entry.getKey();
                        break;
                    }
                }
                if (foundItem != null) break;
            }
            if (foundItem != null) {
                // Ajouter le nombre d'items pour cette catégorie
                itemCountByCategory.merge(itemCategory, orderItem.getHowMany(), Integer::sum);
            }
        }

        return itemCountByCategory;
    }

    private int calculateCompleteMenus(GroupMenu menu, Map<FoodCategory, Integer> itemCountByCategory) {
        int minCount = Integer.MAX_VALUE;

        // Pour chaque catégorie du menu, on regarde combien d'items ont été commandés
        for (FoodCategory category : menu.getItemsByCategory().keySet()) {
            int count = itemCountByCategory.getOrDefault(category, 0);
            minCount = Math.min(minCount, count);
        }
        return minCount == Integer.MAX_VALUE ? 0 : minCount;
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
