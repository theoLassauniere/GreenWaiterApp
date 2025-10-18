package fr.green.BffGreenWaiter.service.table;

import fr.green.BffGreenWaiter.client.DiningClient;
import fr.green.BffGreenWaiter.dto.table.StartOrderingDto;
import fr.green.BffGreenWaiter.dto.table.TableDto;
import fr.green.BffGreenWaiter.dto.table.TableWithOrderDto;
import fr.green.BffGreenWaiter.mapper.TableMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TableService {
    public final DiningClient diningClient;

    public List<TableDto> seedTables(List<TableDto> mocks) {
        List<TableDto> result = new ArrayList<>();
        for (TableDto mock : mocks) {
            TableDto table;
            TableWithOrderDto tableBack;
            try {
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            } catch (Exception e) {
                diningClient.addTable(mock.getTableNumber());
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            }

            if (mock.isOccupied() && (mock.getCommandState() == null || !tableBack.isTaken())) {
                openTableSafe(mock.getTableNumber(), mock.getCapacity());
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            }
            table = TableMapper.toTableDto(tableBack);
            table.setCapacity(mock.getCapacity());
            table.setCommandState(mock.getCommandState());
            table.setCommandPreparationPlace(mock.getCommandPreparationPlace());
            result.add(table);
        }
        return result;
    }
    public List<TableDto> listTables() {
        List<TableWithOrderDto> tablesFromBack = diningClient.listAllTables();
        return tablesFromBack.stream()
                .map(TableMapper::toTableDto)
                .toList();
    }

    public TableDto openTable(StartOrderingDto dto) {
        openTableSafe(dto.getTableNumber(), dto.getCustomersCount());
        var tableBack = diningClient.getTableByNumber(dto.getTableNumber());
        var tableDto = TableMapper.toTableDto(tableBack);
        tableDto.setCapacity(dto.getCustomersCount());
        return tableDto;
    }


    public void openTableSafe(int tableNumber, int customersCount) {
        StartOrderingDto dto = new StartOrderingDto(tableNumber, customersCount);
        diningClient.openTableSafe(dto);
    }
}
