package fr.green.bffgreenwaiter.orders.services;

import fr.green.bffgreenwaiter.orders.dto.MenuItemToOrderDto;
import fr.green.bffgreenwaiter.orders.dto.ShortOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderPreparationService {

    private final WebClient.Builder webClientBuilder;
    private final OrderQueryService orderQueryService;

    @Value("${tableOrders.service.url}")
    private String tablesUrl;

    @Value("${kitchen.service.url}")
    private String kitchenBaseUrl;

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
