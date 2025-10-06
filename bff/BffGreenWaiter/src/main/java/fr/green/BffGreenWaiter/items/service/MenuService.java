// src/main/java/fr/green/BffGreenWaiter/items/service/MenuService.java
package fr.green.BffGreenWaiter.items.service;

import fr.green.BffGreenWaiter.items.model.ItemDB;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Service
public class MenuService {

    private final WebClient.Builder webClientBuilder;

    @Value("${menu.service.url}")
    private String baseUrl;

    public List<ItemDB> fetchItems() {
        try {
            List<ItemDB> result = webClientBuilder
                    .baseUrl(baseUrl)
                    .build()
                    .get()
                    .uri("/menus")
                    .retrieve()
                    .onStatus(
                            HttpStatusCode::isError,
                            resp -> resp.createException()
                                    .map(ex -> new IllegalStateException(
                                            "Erreur menu-service: " + ex.getStatusCode() +
                                                    " - " + ex.getResponseBodyAsString(), ex))
                    )
                    .bodyToFlux(ItemDB.class)
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
}
