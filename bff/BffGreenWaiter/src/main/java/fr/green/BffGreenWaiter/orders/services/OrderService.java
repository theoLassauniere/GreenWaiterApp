package fr.green.BffGreenWaiter.orders.services;


import fr.green.BffGreenWaiter.items.model.Item;
import fr.green.BffGreenWaiter.items.service.MenuService;
import fr.green.BffGreenWaiter.orders.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderService {
    private final WebClient.Builder webClientBuilder;
    private final MenuService menuService;

    @Value("${tableOrders.service.url}")
    private String baseUrl;

    @Value("${kitchen.service.url}")
    private String kitchenBaseUrl;

    public List<SimpleOrderDto> getOrders() {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        return webClient.get()
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<SimpleOrderDto>>() {
                })
                .block();
    }

    public String getOrderForTable(int tableNumber) {
        List<SimpleOrderDto> response = getOrders();

        if (response == null || response.isEmpty()) {
            throw new RuntimeException("No orders found for table " + tableNumber);
        }

        Optional<SimpleOrderDto> optional = response.stream()
                .filter(order -> order.getTableNumber() == tableNumber)
                .findFirst();

        if (optional.isPresent()) {
            return optional.get().get_id();
        } else {
            throw new RuntimeException("No orders found for table " + tableNumber);
        }
    }

    public List<Map<String, Object>> createAndStartPreparation(ShortOrderDto order) {
        WebClient webClient = webClientBuilder.build();

        String orderId = getOrderForTable(order.getTableNumber());
        String orderUrl = baseUrl + "/" + orderId;
        String prepareUrl = orderUrl + "/prepare";

        for (MenuItemToOrderDto item : order.getMenuItems()) {
            webClient.post()
                    .uri(orderUrl)
                    .bodyValue(item)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }

        List<Map<String, Object>> preparations = webClient.post()
                .uri(prepareUrl)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (preparations == null || preparations.isEmpty()) {
            throw new RuntimeException("Aucune préparation créée");
        }

        for (Map<String, Object> prep : preparations) {
            prep.put("tableNumber", order.getTableNumber());
        }

        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");

            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                String startUrl = kitchenBaseUrl + "/preparedItems/" + itemId + "/start";
                webClientBuilder.build()
                        .post()
                        .uri(startUrl)
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            }
        }

        return preparations;
    }

    public List<Map<String, Object>> finishPreparation(List<Map<String, Object>> preparations) {
        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");
            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                String finishUrl = kitchenBaseUrl + "/preparedItems/" + itemId + "/finish";
                webClientBuilder.build()
                        .post()
                        .uri(finishUrl)
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            }
        }

        return preparations;
    }

    public List<OrderItemDTO> getOrderItems(int tableNumber) {
        String orderId = getOrderForTable(tableNumber);
        String orderUrl = "/" + orderId;

        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        OrderLineDto order = webClient.get()
                .uri(orderUrl)
                .retrieve()
                .bodyToMono(OrderLineDto.class)
                .block();

        if (order == null || order.getLines() == null) {
            throw new RuntimeException("No order lines found for table " + tableNumber);
        }

        return order.getLines().stream()
                .map(line -> {
                    Item item = menuService.fetchItemById(line.getItem().get_id());
                    return new OrderItemDTO(
                            item.get_id(),
                            item.getFullName(),
                            item.getShortName(),
                            item.getPrice(),
                            item.getCategory(),
                            line.getHowMany()
                    );
                })
                .toList();
    }

    public Map<String, Object> markPreparationAsServed(String preparationId) {
        WebClient webClient = webClientBuilder.baseUrl(kitchenBaseUrl).build();

        return webClient.post()
                .uri("/preparations/" + preparationId + "/takenToTable")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public String billOrder(int tableNumber) {
        String orderId = getOrderForTable(tableNumber);
        String billUrl = "/" + orderId + "/bill";

        try {
            return webClientBuilder.baseUrl(baseUrl).build()
                    .post()
                    .uri(billUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la facturation de la table " + tableNumber, e);
        }
    }
}
