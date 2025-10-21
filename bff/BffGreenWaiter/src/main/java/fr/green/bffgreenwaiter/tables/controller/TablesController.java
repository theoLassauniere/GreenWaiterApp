package fr.green.bffgreenwaiter.tables.controller;

import fr.green.bffgreenwaiter.tables.dto.StartOrderingDto;
import fr.green.bffgreenwaiter.tables.dto.TableDto;
import fr.green.bffgreenwaiter.tables.dto.TableWithOrderDto;
import fr.green.bffgreenwaiter.tables.mapper.TableMapper;
import fr.green.bffgreenwaiter.tables.services.DiningApiClient;
import fr.green.bffgreenwaiter.tables.services.TableOrderServiceClient;
import fr.green.bffgreenwaiter.tables.services.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tables")
public class TablesController {
    private final DiningApiClient diningClient;
    private final TableOrderServiceClient orderClient;
    private final TableService tableService;

    @PostMapping("/seed")
    public List<TableDto> seedTables(@RequestBody List<TableDto> mocks) {
        return tableService.seedTables(mocks);
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
