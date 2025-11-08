package fr.green.bffgreenwaiter.orders.services;

import fr.green.bffgreenwaiter.items.model.ItemWithAllergens;
import fr.green.bffgreenwaiter.items.service.MenuApiClient;
import fr.green.bffgreenwaiter.orders.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderQueryService {

    private final WebClient.Builder webClientBuilder;
    private final MenuApiClient menuApiClient;

    @Value("${tableOrders.service.url}")
    private String tablesUrl;

    public List<SimpleOrderDto> getOrders() {
        return webClientBuilder.baseUrl(tablesUrl).build()
                .get()
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<SimpleOrderDto>>() {})
                .block();
    }

    public String getOrderForTable(int tableNumber) {
        List<SimpleOrderDto> response = getOrders();

        if (response == null || response.isEmpty()) {
            throw new RuntimeException("No orders found for table " + tableNumber);
        }

        return response.stream()
                .filter(order -> order.getTableNumber() == tableNumber && order.getBilled() == null)
                .map(SimpleOrderDto::get_id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active order for table " + tableNumber));
    }

    public List<OrderItemDto> getOrderItems(int tableNumber) {
        String orderId = getOrderForTable(tableNumber);
        String orderUrl = "/" + orderId;

        WebClient webClient = webClientBuilder.baseUrl(tablesUrl).build();

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
                    ItemWithAllergens itemWithAllergens = menuApiClient.fetchItemById(line.getItem().get_id());
                    return new OrderItemDto(
                            itemWithAllergens.get_id(),
                            itemWithAllergens.getFullName(),
                            itemWithAllergens.getShortName(),
                            itemWithAllergens.getPrice(),
                            itemWithAllergens.getCategory(),
                            line.getHowMany()
                    );
                })
                .toList();
    }
}
