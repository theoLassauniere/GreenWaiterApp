package fr.green.BffGreenWaiter.tables.controller;

import fr.green.BffGreenWaiter.tables.dto.TableDto;
import fr.green.BffGreenWaiter.tables.dto.TableWithOrderDto;
import fr.green.BffGreenWaiter.tables.mapper.TableMapper;
import fr.green.BffGreenWaiter.tables.services.DiningServiceClient;
import fr.green.BffGreenWaiter.tables.services.TableOrderServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tables")
public class TablesController {
    private final DiningServiceClient diningClient;
    private final TableOrderServiceClient orderClient;

    @PostMapping("/seed")
    public List<TableDto> seedTables(@RequestBody List<TableDto> mocks) {
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
                orderClient.openTableSafe(mock.getTableNumber(), mock.getCapacity());
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

    @GetMapping
    public List<TableDto> listTables() {
        List<TableWithOrderDto> tablesFromBack = diningClient.listAllTables();
        return tablesFromBack.stream()
                .map(TableMapper::toTableDto)
                .toList();
    }
}
