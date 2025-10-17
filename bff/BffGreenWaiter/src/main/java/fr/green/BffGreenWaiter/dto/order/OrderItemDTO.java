package fr.green.BffGreenWaiter.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemDTO {
    private String id;
    private String name;
    private String shortName;
    private double price;
    private String category;
    private int quantity;
}
