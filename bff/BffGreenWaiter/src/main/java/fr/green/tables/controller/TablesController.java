package fr.green.tables.controller;

import fr.green.tables.dto.StartOrderingDto;
import fr.green.tables.dto.TableDto;
import fr.green.tables.services.DiningServiceClient;
import fr.green.tables.services.TableOrderServiceClient;
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
            diningClient.addTable(mock.getTableNumber());

            if (mock.isOccupied()) {
                orderClient.openTable(new StartOrderingDto(mock.getTableNumber(), mock.getCapacity()));
            }

            TableDto table = diningClient.getTableByNumber(mock.getTableNumber());
            table.setCapacity(mock.getCapacity());
            table.setCommandState(mock.getCommandState());
            table.setCommandPreparationPlace(mock.getCommandPreparationPlace());

            result.add(table);
        }

        return result;
    }

    @GetMapping
    public List<TableDto> listTables() {
        return diningClient.listAllTables();
    }

    @PostMapping("/open")
    public TableDto openTable(@RequestBody StartOrderingDto dto) {
        orderClient.openTable(dto);
        TableDto table = diningClient.getTableByNumber(dto.getTableNumber());
        table.setCapacity(dto.getCustomersCount());
        return table;
    }
}
