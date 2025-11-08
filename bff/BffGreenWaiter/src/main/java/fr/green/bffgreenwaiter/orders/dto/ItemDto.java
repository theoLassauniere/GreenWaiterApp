package fr.green.bffgreenwaiter.orders.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ItemDto {
    private String id;
    private String name;
    private String shortName;
    private double price;
    private String category;
    private int quantity;
}
