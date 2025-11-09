package fr.green.bffgreenwaiter.orders.services;

import fr.green.bffgreenwaiter.orders.dto.OrderItemDto;
import fr.green.bffgreenwaiter.orders.dto.ShortOrderDto;
import fr.green.bffgreenwaiter.orders.dto.SimpleOrderDto;
import fr.green.bffgreenwaiter.tables.services.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceFacade {

    private final OrderQueryService queryService;
    private final OrderPreparationService preparationService;
    private final OrderBillingService billingService;
    private final OrderServingService servingService;

    public List<SimpleOrderDto> getOrders() {
        return queryService.getOrders();
    }

    public String getOrderForTable(int tableNumber) {
        return queryService.getOrderForTable(tableNumber);
    }

    public List<OrderItemDto> getOrderItems(int tableNumber) {
        return queryService.getOrderItems(tableNumber);
    }

    public List<Map<String, Object>> createAndStartPreparation(ShortOrderDto order) {
        return preparationService.createAndStartPreparation(order);
    }

    public List<Map<String, Object>> createAndStartPreparationOrder(ShortOrderDto order, int groupId) {
        return preparationService.createAndStartPreparationOrder(order, groupId);
    }

    public List<Map<String, Object>> finishPreparation(List<Map<String, Object>> preparations) {
        return preparationService.finishPreparation(preparations);
    }

    public String billOrder(int tableNumber) {
        return billingService.billOrder(tableNumber);
    }

    public Map<String, Object> markPreparationAsServed(String prepId) {
        return servingService.markPreparationAsServed(prepId);
    }
}
