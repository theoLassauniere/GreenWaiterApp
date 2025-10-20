package fr.green.bffgreenwaiter.tables.controller;

import fr.green.bffgreenwaiter.tables.dto.StartOrderingDto;
import fr.green.bffgreenwaiter.tables.dto.TableDto;
import fr.green.bffgreenwaiter.tables.dto.TableWithOrderDto;
import fr.green.bffgreenwaiter.tables.mapper.TableMapper;
import fr.green.bffgreenwaiter.tables.services.DiningApiClient;
import fr.green.bffgreenwaiter.tables.services.TableOrderServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tables")
public class TablesController {
    private final DiningApiClient diningClient;
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

    @PostMapping("/openForOrders")
    public TableDto openTable(@RequestBody StartOrderingDto dto) {
        orderClient.openTableSafe(dto.getTableNumber(), dto.getCustomersCount());
        var tableBack = diningClient.getTableByNumber(dto.getTableNumber());
        var tableDto = TableMapper.toTableDto(tableBack);
        tableDto.setCapacity(dto.getCustomersCount());
        return tableDto;
    }
}
