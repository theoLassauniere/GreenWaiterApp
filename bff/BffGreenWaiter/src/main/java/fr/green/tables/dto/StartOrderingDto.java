package fr.green.tables.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartOrderingDto {
    private int tableNumber;
    private int customersCount;
}
