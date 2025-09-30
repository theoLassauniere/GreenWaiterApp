package fr.green.tables.services;

import fr.green.tables.dto.TableDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DiningServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "http://localhost:9500/dining/tables";

    public TableDto addTable(int tableNumber) {
        return restTemplate.postForObject(baseUrl, new TableDtoRequest(tableNumber), TableDto.class);
    }

    public List<TableDto> listAllTables() {
        TableDto[] response = restTemplate.getForObject(baseUrl, TableDto[].class);
        return Arrays.asList(response);
    }

    public TableDto getTableByNumber(int number) {
        return restTemplate.getForObject(baseUrl + "/" + number, TableDto.class);
    }

    record TableDtoRequest(int number) {}
}

