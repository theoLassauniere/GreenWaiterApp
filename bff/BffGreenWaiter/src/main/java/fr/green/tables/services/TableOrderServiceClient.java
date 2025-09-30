package fr.green.tables.services;

import fr.green.tables.dto.StartOrderingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class TableOrderServiceClient {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${tableOrders.service.url}")
    private String baseUrl;

    public void openTableSafe(int tableNumber, int customersCount) {
        StartOrderingDto dto = new StartOrderingDto(tableNumber, customersCount);

        try {
            restTemplate.postForObject(baseUrl, dto, Void.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                System.out.println("Table " + tableNumber + " already taken, skipping openTable.");
            } else {
                throw e;
            }
        }
    }
}
