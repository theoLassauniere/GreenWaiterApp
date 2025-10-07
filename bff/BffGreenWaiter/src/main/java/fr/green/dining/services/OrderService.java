package fr.green.dining.services;


import fr.green.dining.dto.PreparationDto;
import fr.green.dining.dto.PreparedItemDto;
import fr.green.dining.dto.SimpleOrderDto;
import fr.green.dining.enums.PreparationStatus;
import fr.green.tables.dto.TableDto;
import fr.green.tables.dto.TableWithOrderDto;
import fr.green.tables.services.DiningServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderService {
    private final WebClient.Builder webClientBuilder;

    @Value("${tableOrders.service.url}")
    private String baseUrl;

    public PreparedItemDto createNewOrder(PreparationDto preparation) {
        DiningServiceClient diningServiceClient = new DiningServiceClient(webClientBuilder);

        TableWithOrderDto table = diningServiceClient.getTableByNumber(preparation.getTableNumber());
        if (!table.isTaken()) throw new RuntimeException("Table is not occupied. Cannot create order for it.");

        return new PreparedItemDto();
    }

    public String getReadyOrders(PreparationStatus state) {
        return "fetched getReadyOrders with state: " + state;
    }

    public List<SimpleOrderDto> getOrders() {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        return webClient.get()
                .retrieve()
                .bodyToMono(List.class)
                .block();
    }


}
