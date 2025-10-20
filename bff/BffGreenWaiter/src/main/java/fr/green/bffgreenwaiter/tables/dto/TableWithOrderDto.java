package fr.green.bffgreenwaiter.tables.dto;

import lombok.Data;

@Data
public class TableWithOrderDto {
    private String _id;
    private int number;
    private boolean taken;
    private String tableOrderId;
}
