package fr.green.BffGreenWaiter.service.table;

import fr.green.BffGreenWaiter.client.DiningClient;
import fr.green.BffGreenWaiter.dto.table.StartOrderingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class TableOrderService {
    public final DiningClient diningClient;

    public void openTableSafe(int tableNumber, int customersCount) {
        StartOrderingDto dto = new StartOrderingDto(tableNumber, customersCount);
        diningClient.openTableSafe(dto);
    }
}
