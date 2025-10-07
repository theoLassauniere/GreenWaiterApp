package fr.green.BffGreenWaiter.dining.services;


import fr.green.BffGreenWaiter.dining.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;


import java.util.List;
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
                .bodyToMono(List.class)
                .block();
    }

    public String getOrderForTable(int tableNumber) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        List<SimpleOrderDto> response = webClient.get()
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<SimpleOrderDto>>() {})
                .block();

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

    public void createNewOrderFull(ShortOrderDto order) {
        String orderId = getOrderForTable(order.getTableNumber());
        String url = baseUrl + "/" + orderId;
        WebClient webClient = webClientBuilder.baseUrl(url).build();

        for (MenuItemToOrderDto menuItem : order.getMenuItems()) {
            webClient.post()
                    .bodyValue(menuItem)
                    .retrieve()
                    .bodyToMono(MenuItemToOrderDto.class)
                    .block();
        }
    }
}
