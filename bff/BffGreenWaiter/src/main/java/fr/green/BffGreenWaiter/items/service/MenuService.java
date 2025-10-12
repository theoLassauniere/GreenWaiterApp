package fr.green.BffGreenWaiter.items.service;

import fr.green.BffGreenWaiter.items.model.Item;
import fr.green.BffGreenWaiter.items.model.ItemRaw;
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

    public List<ItemRaw> fetchItems() {
        try {
            List<ItemRaw> result = webClientBuilder
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

    public Item fetchItemById(String id) {
        try {
            Item result = webClientBuilder
                    .baseUrl(baseUrl)
                    .build()
                    .get()
                    .uri("/menus/{id}", id)
                    .retrieve()
                    .onStatus(
                            HttpStatusCode::isError,
                            resp -> resp.createException()
                                    .map(ex -> new IllegalStateException(
                                            "Erreur HTTP menu-service: " + ex.getStatusCode() +
                                                    " - " + ex.getResponseBodyAsString(), ex))
                    )
                    .bodyToMono(Item.class)
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
