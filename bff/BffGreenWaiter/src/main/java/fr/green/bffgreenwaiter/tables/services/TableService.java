package fr.green.bffgreenwaiter.tables.services;

import fr.green.bffgreenwaiter.tables.dto.TableDto;
import fr.green.bffgreenwaiter.tables.dto.TableWithOrderDto;
import fr.green.bffgreenwaiter.tables.mapper.TableMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final DiningApiClient diningClient;
    private final TableOrderServiceClient tableOrderClient;

    public List<TableDto> seedTables(List<TableDto> mocks) {
        Map<Integer, List<TableDto>> grouped = mocks.stream()
                .collect(Collectors.groupingBy(
                        t -> (t.getGroupId() == null || t.getGroupId() == 0)
                                ? t.getTableNumber()
                                : t.getGroupId(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
        List<TableDto> result = new ArrayList<>();
        for (List<TableDto> group : grouped.values()) {
            result.addAll(seedTableGroup(group));
        }
        return result.stream()
                .sorted(Comparator.comparingInt(TableDto::getTableNumber))
                .toList();
    }

    private List<TableDto> seedTableGroup(List<TableDto> groupMocks) {
        List<TableDto> result = new ArrayList<>();
        boolean anyOccupied = groupMocks.stream().anyMatch(TableDto::isOccupied);
        int capacity = groupMocks.stream().mapToInt(TableDto::getCapacity).max().orElse(2);
        for (TableDto mock : groupMocks) {
            TableWithOrderDto tableBack;
            try {
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            } catch (Exception e) {
                diningClient.addTable(mock.getTableNumber());
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            }
            if (anyOccupied && !tableBack.isTaken()) {
                tableOrderClient.openTableSafe(mock.getTableNumber(), capacity);
                tableBack = diningClient.getTableByNumber(mock.getTableNumber());
            }
            TableDto dto = TableMapper.fromMock(mock, tableBack);
            result.add(dto);
        }
        return result;
    }
}
