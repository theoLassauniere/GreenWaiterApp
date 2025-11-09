package fr.green.bffgreenwaiter.tables.mapper;

import fr.green.bffgreenwaiter.tables.dto.TableDto;
import fr.green.bffgreenwaiter.tables.dto.TableWithOrderDto;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TableMapper {

    public static TableDto toTableDto(TableWithOrderDto source) {
        TableDto dto = new TableDto();
        dto.setId(source.get_id());
        dto.setTableNumber(source.getNumber());
        dto.setCapacity(2);
        dto.setOccupied(source.isTaken());
        dto.setCommandState(null);
        dto.setCommandPreparationPlace(null);
        return dto;
    }

    public static TableDto fromMock(TableDto mock, TableWithOrderDto tableBack) {
        TableDto dto = toTableDto(tableBack);
        dto.setGroupId(mock.getGroupId());
        dto.setCapacity(mock.getCapacity());
        dto.setCommandState(mock.getCommandState());
        dto.setCommandPreparationPlace(mock.getCommandPreparationPlace());
        return dto;
    }
}
