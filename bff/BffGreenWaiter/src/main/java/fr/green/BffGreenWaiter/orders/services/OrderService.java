package fr.green.BffGreenWaiter.orders.services;


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

    @Value("${tableOrders.service.url}")
    private String baseUrl;

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

    public List<Map<String, Object>> createNewOrderFull(ShortOrderDto order) {
        String orderId = getOrderForTable(order.getTableNumber());
        String orderUrl = baseUrl + "/" + orderId;
        String prepareUrl = baseUrl + "/" + orderId + "/prepare";

        WebClient webClient = webClientBuilder.build();

        for (MenuItemToOrderDto menuItem : order.getMenuItems()) {
            webClient.post()
                    .uri(orderUrl)
                    .bodyValue(menuItem)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        }

        return webClient.post()
                .uri(prepareUrl)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }
}
