package fr.green.BffGreenWaiter.controller;

import fr.green.BffGreenWaiter.dto.table.StartOrderingDto;
import fr.green.BffGreenWaiter.dto.table.TableDto;
import fr.green.BffGreenWaiter.service.table.TableService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tables")
public class TablesController {
    private final TableService tableService;

    @PostMapping("/seed")
    public List<TableDto> seedTables(@RequestBody List<TableDto> mocks) {
        return tableService.seedTables(mocks);
    }

    @GetMapping
    public List<TableDto> listTables() {
        return tableService.listTables();
    }

    @PostMapping("/openForOrders")
    public TableDto openTable(@RequestBody StartOrderingDto dto) {
        return tableService.openTable(dto);
    }
}
