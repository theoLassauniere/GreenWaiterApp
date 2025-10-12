package fr.green.BffGreenWaiter.orders.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ShortOrderDto {
    int tableNumber;
    List<MenuItemToOrderDto> menuItems;
    boolean billed;
}
