
package fr.green.bffgreenwaiter.tables.dto;

import lombok.Data;

@Data
public class TableDto {
    private String id;
    private Integer groupId;
    private int tableNumber;
    private int capacity;
    private boolean occupied;
    private String commandState;
    private String commandPreparationPlace;
}
