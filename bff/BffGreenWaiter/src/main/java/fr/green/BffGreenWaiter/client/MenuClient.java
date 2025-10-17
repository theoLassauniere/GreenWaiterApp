package fr.green.BffGreenWaiter.client;

import fr.green.BffGreenWaiter.model.ItemRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MenuClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${menu.service.url}")
    private String baseUrl;

    public List<ItemRaw> getItems() {
        try {
            WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
            List<ItemRaw> result = webClient
                    .get()
                    .uri("/menus")
                    .retrieve()
                    .onStatus(HttpStatusCode::isError,
                            resp -> resp.createException().flatMap(ex ->
                                    Mono.error(new IllegalStateException(
                                            "Erreur menu-service: " + ex.getStatusCode() +
                                                    " - " + ex.getResponseBodyAsString(), ex))
                            )
                    )
                    .bodyToFlux(ItemRaw.class)
                    .timeout(Duration.ofSeconds(5))
                    .collectList()
                    .block();

            return result != null ? result : Collections.emptyList();
        } catch (WebClientResponseException e) {
            throw new IllegalStateException("Erreur HTTP menu-service: " + e.getStatusCode()
                    + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de récupérer les items menu", e);
        }
    }

    public ItemRaw getItemById(String id) {
        try {
            WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();
            ItemRaw result = webClient
                    .get()
                    .uri("/menus/{id}", id)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError,
                            resp -> resp.createException().flatMap(ex ->
                                    Mono.error(new IllegalStateException(
                                            "Erreur HTTP menu-service: " + ex.getStatusCode() +
                                                    " - " + ex.getResponseBodyAsString(), ex))
                            )
                    )
                    .bodyToMono(ItemRaw.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (result == null) {
                throw new IllegalStateException("Item non trouvé avec l'ID: " + id);
            }

            return result;
        } catch (WebClientResponseException e) {
            throw new IllegalStateException("Erreur HTTP menu-service: " + e.getStatusCode()
                    + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de récupérer l'item avec l'ID: " + id, e);
        }
    }
}
