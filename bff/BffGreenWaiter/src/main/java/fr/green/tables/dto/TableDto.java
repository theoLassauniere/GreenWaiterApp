package fr.green.tables.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TableDto {
    private String id;
    private int tableNumber;
    private int capacity;
    private boolean occupied;
    @JsonProperty("isCommandesPage")
    private boolean isCommandesPage;
    private String commandState;
    private String commandPreparationPlace;
}
