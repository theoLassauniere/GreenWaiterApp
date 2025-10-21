package fr.green.bffgreenwaiter.tables.services;

import fr.green.bffgreenwaiter.tables.dto.StartOrderingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
@RequiredArgsConstructor
public class TableOrderServiceClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${tableOrders.service.url}")
    private String tableOrdersUrl;

    public void openTableSafe(int tableNumber, int customersCount) {
        StartOrderingDto dto = new StartOrderingDto(tableNumber, customersCount);

        WebClient webClient = webClientBuilder.baseUrl(tableOrdersUrl).build();

        try {
            webClient.post()
                    .bodyValue(dto)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                System.out.println("Table " + tableNumber + " already taken, skipping openTable.");
            } else {
                throw e;
            }
        }
    }
}
