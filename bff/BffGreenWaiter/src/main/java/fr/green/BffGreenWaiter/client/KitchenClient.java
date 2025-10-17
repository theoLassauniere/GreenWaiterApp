package fr.green.BffGreenWaiter.client;

import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class KitchenClient {
    private final String baseUrl;
    private final WebClient.Builder webClientBuilder;


    public KitchenClient(WebClient.Builder webClientBuilder, @Value("${kitchen.service.url}") String baseUrl) {
        this.webClientBuilder = webClientBuilder;
        this.baseUrl = baseUrl;
    }

    public Mono<Void> startPreparation(String itemId) {
        return webClientBuilder.baseUrl(baseUrl).build()
                .post()
                .uri("/preparedItems/{itemId}/start", itemId)
                .retrieve()
                .bodyToMono(Void.class);
    }

    public Mono<Void> finishPreparation(String itemId) {
        return webClientBuilder.baseUrl(baseUrl).build()
                .post()
                .uri("/preparedItems/{itemId}/start", itemId)
                .retrieve()
                .bodyToMono(Void.class);
    }

    public Map<String, Object> markPreparationAsServed(String preparationId) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        return webClient.post()
                .uri("/preparations/{preparationId}/takenToTable", preparationId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

}
