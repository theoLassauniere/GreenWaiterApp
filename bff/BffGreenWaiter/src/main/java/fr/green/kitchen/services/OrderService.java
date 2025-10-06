package fr.green.kitchen.services;


import fr.green.kitchen.dto.PreparationDto;
import fr.green.kitchen.dto.PreparedItemDto;
import fr.green.kitchen.enums.PreparationStatus;
import fr.green.tables.dto.StartOrderingDto;
import fr.green.tables.dto.TableWithOrderDto;
import fr.green.tables.services.DiningServiceClient;
import fr.green.tables.services.TableOrderServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class OrderService {
    private final WebClient.Builder webClientBuilder;

    @Value("${orders.service.url}")
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
}
