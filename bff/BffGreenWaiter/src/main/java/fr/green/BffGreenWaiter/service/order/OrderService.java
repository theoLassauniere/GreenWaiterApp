package fr.green.BffGreenWaiter.service.order;


import fr.green.BffGreenWaiter.client.DiningClient;
import fr.green.BffGreenWaiter.client.KitchenClient;
import fr.green.BffGreenWaiter.client.MenuClient;
import fr.green.BffGreenWaiter.dto.order.OrderLineDto;
import fr.green.BffGreenWaiter.dto.order.SimpleOrderDto;
import fr.green.BffGreenWaiter.dto.order.ShortOrderDto;
import fr.green.BffGreenWaiter.dto.order.MenuItemToOrderDto;
import fr.green.BffGreenWaiter.dto.order.OrderItemDTO;


import fr.green.BffGreenWaiter.model.ItemRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderService {
    private final WebClient.Builder webClientBuilder;
    private final MenuClient menuClient;
    private final DiningClient diningClient;
    private final KitchenClient kitchenClient;

    public List<SimpleOrderDto> getOrders() {
        return diningClient.getOrders();
    }

    public String getOrderForTable(int tableNumber) {
        List<SimpleOrderDto> response = diningClient.getOrders();
        Optional<SimpleOrderDto> optional = response.stream()
                .filter(order -> order.getTableNumber() == tableNumber && order.getBilled() == null)
                .findFirst();

        if (optional.isPresent()) {
            return optional.get().get_id();
        } else {
            throw new RuntimeException("No orders found for table " + tableNumber);
        }
    }

    public List<Map<String, Object>> createAndStartPreparation(ShortOrderDto order) {
        String orderId = getOrderForTable(order.getTableNumber());
        for (MenuItemToOrderDto item : order.getMenuItems()) {
            diningClient.addItemToOrder(orderId, item).block();
        }

        List<Map<String, Object>> preparations = diningClient.prepareOrder(orderId);

        for (Map<String, Object> prep : preparations) {
            prep.put("tableNumber", order.getTableNumber());
        }

        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");

            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                kitchenClient.startPreparation(itemId);
            }
        }

        return preparations;
    }

    public List<Map<String, Object>> finishPreparation(List<Map<String, Object>> preparations) {
        for (Map<String, Object> prep : preparations) {
            List<Map<String, Object>> preparedItems =
                    (List<Map<String, Object>>) prep.get("preparedItems");
            if (preparedItems == null) continue;

            for (Map<String, Object> item : preparedItems) {
                String itemId = (String) item.get("_id");
                kitchenClient.finishPreparation(itemId);
            }
        }
        return preparations;

    }

    public List<OrderItemDTO> getOrderItems(int tableNumber) {
        String orderId = getOrderForTable(tableNumber);

        OrderLineDto order = diningClient.getOrderById(orderId);

        return order.getLines().stream()
                .map(line -> {
                    ItemRaw item = menuClient.getItemById(line.getItem().get_id());
                    return new OrderItemDTO(
                            item.get_id(),
                            item.getFullName(),
                            item.getShortName(),
                            item.getPrice(),
                            item.getCategory(),
                            line.getHowMany()
                    );
                })
                .toList();
    }

    public Map<String, Object> markPreparationAsServed(String preparationId) {
        return kitchenClient.markPreparationAsServed(preparationId);
    }

    public String billOrder(int tableNumber) {
        String orderId = getOrderForTable(tableNumber);
        return diningClient.billOrder(orderId);

    }
}
