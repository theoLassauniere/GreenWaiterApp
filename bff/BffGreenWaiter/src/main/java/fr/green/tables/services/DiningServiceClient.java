package fr.green.tables.services;

import fr.green.tables.dto.TableDto;
import fr.green.tables.dto.TableWithOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DiningServiceClient {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${dining.service.url}")
    private String baseUrl;

    public void addTable(int tableNumber) {
        restTemplate.postForObject(baseUrl, new TableDtoRequest(tableNumber), TableDto.class);
    }

    public List<TableWithOrderDto> listAllTables() {
        TableWithOrderDto[] response = restTemplate.getForObject(baseUrl, TableWithOrderDto[].class);
        return Arrays.asList(response);
    }

    public TableWithOrderDto getTableByNumber(int number) {
        return restTemplate.getForObject(baseUrl + "/" + number, TableWithOrderDto.class);
    }

    record TableDtoRequest(int number) {}
}

