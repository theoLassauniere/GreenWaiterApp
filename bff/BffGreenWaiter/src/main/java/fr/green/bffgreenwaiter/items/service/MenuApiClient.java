package fr.green.bffgreenwaiter.items.service;

import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.model.ItemRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuApiClient {

    private final WebClient webClient;

    @Value("${menu.service.url}")
    private String baseUrl;

    public List<ItemRaw> fetchItems() {
        try {
            List<ItemRaw> result = webClient.get()
                    .uri(baseUrl + "/menus")
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
            Item result = webClient.get()
                    .uri(baseUrl + "/menus/{id}", id)
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
