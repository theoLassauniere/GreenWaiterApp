package fr.green.bffgreenwaiter.tables.services;

import fr.green.bffgreenwaiter.tables.dto.TableDto;
import fr.green.bffgreenwaiter.tables.dto.TableWithOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiningApiClient {

    private final WebClient webClient;

    @Value("${table.service.url}")
    private String tableServiceUrl;

    public void addTable(int tableNumber) {
        webClient.post()
                .uri(tableServiceUrl)
                .bodyValue(new TableDtoRequest(tableNumber))
                .retrieve()
                .bodyToMono(TableDto.class)
                .block();
    }

    public List<TableWithOrderDto> listAllTables() {
        TableWithOrderDto[] response = webClient.get()
                .uri(tableServiceUrl)
                .retrieve()
                .bodyToMono(TableWithOrderDto[].class)
                .block();

        return Arrays.asList(response);
    }

    public TableWithOrderDto getTableByNumber(int number) {
        return webClient.get()
                .uri(tableServiceUrl + "/{number}", number)
                .retrieve()
                .bodyToMono(TableWithOrderDto.class)
                .block();
    }

    private record TableDtoRequest(int number) {}
}
