package fr.green.bffgreenwaiter.orders.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class OrderBillingService {

    private final WebClient.Builder webClientBuilder;
    private final OrderQueryService orderQueryService;

    @Value("${tableOrders.service.url}")
    private String tablesUrl;

    public String billOrder(int tableNumber) {
        String orderId = orderQueryService.getOrderForTable(tableNumber);
        String billUrl = "/" + orderId + "/bill";

        try {
            return webClientBuilder.baseUrl(tablesUrl).build()
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
