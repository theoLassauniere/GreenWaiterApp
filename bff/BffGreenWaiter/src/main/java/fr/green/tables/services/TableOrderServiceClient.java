package fr.green.tables.services;

import fr.green.tables.dto.StartOrderingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class TableOrderServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "http://localhost:9500/dining/tableOrders";

    public void openTable(StartOrderingDto dto) {
        restTemplate.postForObject(baseUrl, dto, Void.class);
    }
}
