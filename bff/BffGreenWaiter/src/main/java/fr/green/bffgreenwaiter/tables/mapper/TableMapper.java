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
}

