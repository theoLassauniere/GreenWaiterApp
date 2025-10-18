package fr.green.BffGreenWaiter.client;

import fr.green.BffGreenWaiter.dto.order.MenuItemToOrderDto;
import fr.green.BffGreenWaiter.dto.order.OrderLineDto;
import fr.green.BffGreenWaiter.dto.order.SimpleOrderDto;
import fr.green.BffGreenWaiter.dto.table.StartOrderingDto;
import fr.green.BffGreenWaiter.dto.table.TableDto;
import fr.green.BffGreenWaiter.dto.table.TableWithOrderDto;
import fr.green.BffGreenWaiter.dto.table.TableDtoRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class DiningClient {

    private final WebClient.Builder webClientBuilder;
    private final String tableUrl;
    private final String baseUrl;
    private final String orderUrl;


    public DiningClient(WebClient.Builder webClientBuilder, @Value("${dining.service.url}") String baseUrl) {
        this.webClientBuilder = webClientBuilder;
        this.baseUrl = baseUrl;
        this.tableUrl = baseUrl + "/tables";
        this.orderUrl = baseUrl + "/tableOrders";

    }

    public List<SimpleOrderDto> getOrders() {
        WebClient webClient = webClientBuilder.baseUrl(orderUrl).build();

        List<SimpleOrderDto> orders =  webClient.get()
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<SimpleOrderDto>>() {})
                .block();

        if (orders == null || orders.isEmpty()) {
            throw new RuntimeException("No orders found for tables.");
        }
        return orders;
    }

    public Mono<Void> addItemToOrder(String orderId, MenuItemToOrderDto item) {
        return webClientBuilder.baseUrl(orderUrl).build()
                .post()
                .uri("/{orderId}", orderId)
                .bodyValue(item)
                .retrieve()
                .bodyToMono(Void.class);
    }

    public List<Map<String, Object>> prepareOrder(String orderId) {
        List<Map<String, Object>> preparations = webClientBuilder.baseUrl(orderUrl).build()
                .post()
                .uri("/{orderId}/prepare", orderId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (preparations == null || preparations.isEmpty()) {
            throw new RuntimeException("Aucune préparation créée pour la commande " + orderId);
        }
        return preparations;
    }

    public OrderLineDto getOrderById(String orderId) {
        OrderLineDto order = webClientBuilder.baseUrl(orderUrl).build()
                .get()
                .uri("/{orderId}", orderId)
                .retrieve()
                .bodyToMono(OrderLineDto.class)
                .block();

        if (order == null || order.getLines() == null) {
            throw new RuntimeException("Aucune ligne de commande trouvée pour l'ID " + orderId);
        }
        return order;
    }

    public void addTable(int tableNumber) {
        WebClient webClient = webClientBuilder.baseUrl(tableUrl).build();

        webClient.post()
                .bodyValue(new TableDtoRequest(tableNumber))
                .retrieve()
                .bodyToMono(TableDto.class)
                .block();
    }

    public List<TableWithOrderDto> listAllTables() {
        WebClient webClient = webClientBuilder.baseUrl(tableUrl).build();

        TableWithOrderDto[] response = webClient.get()
                .retrieve()
                .bodyToMono(TableWithOrderDto[].class)
                .block();

        return Arrays.asList(response);
    }

    public TableWithOrderDto getTableByNumber(int number) {
        WebClient webClient = webClientBuilder.baseUrl(tableUrl).build();

        return webClient.get()
                .uri("/{number}", number)
                .retrieve()
                .bodyToMono(TableWithOrderDto.class)
                .block();
    }

    public void openTableSafe(StartOrderingDto dto ) {
        WebClient webClient = webClientBuilder.baseUrl(tableUrl).build();

        try {
            webClient.post()
                    .bodyValue(dto)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                System.out.println("Table " + dto.getTableNumber() + " already taken, skipping openTable.");
            } else {
                throw e;
            }
        }
    }

    public String billOrder(String orderId ) {
        try {
            return webClientBuilder.baseUrl(orderUrl).build()
                    .post()
                    .uri("/{orderId}/bill", orderId)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la facturation de la table pr l'orderId " + orderId, e);
        }
    }
}