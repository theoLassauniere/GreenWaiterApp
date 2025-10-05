package fr.green.BffGreenWaiter.tables.dto;

import lombok.Data;

@Data
public class TableWithOrderDto {
    private String _id;
    private int number;
    private boolean taken;
    private String tableOrderId;
}
