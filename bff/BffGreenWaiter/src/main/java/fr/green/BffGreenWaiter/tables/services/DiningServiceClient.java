package fr.green.BffGreenWaiter.tables.services;

import fr.green.BffGreenWaiter.tables.dto.TableDto;
import fr.green.BffGreenWaiter.tables.dto.TableWithOrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DiningServiceClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${dining.service.url}")
    private String baseUrl;

    public void addTable(int tableNumber) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        webClient.post()
                .bodyValue(new TableDtoRequest(tableNumber))
                .retrieve()
                .bodyToMono(TableDto.class)
                .block();
    }

    public List<TableWithOrderDto> listAllTables() {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        TableWithOrderDto[] response = webClient.get()
                .retrieve()
                .bodyToMono(TableWithOrderDto[].class)
                .block();

        return Arrays.asList(response);
    }

    public TableWithOrderDto getTableByNumber(int number) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        return webClient.get()
                .uri("/{number}", number)
                .retrieve()
                .bodyToMono(TableWithOrderDto.class)
                .block();
    }

    record TableDtoRequest(int number) {}
}

