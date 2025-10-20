package fr.green.bffgreenwaiter.orders.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServingService {

    private final WebClient.Builder webClientBuilder;

    @Value("${kitchen.service.url}")
    private String kitchenBaseUrl;

    public Map<String, Object> markPreparationAsServed(String preparationId) {
        WebClient webClient = webClientBuilder.baseUrl(kitchenBaseUrl).build();

        return webClient.post()
                .uri("/preparations/" + preparationId + "/takenToTable")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}
