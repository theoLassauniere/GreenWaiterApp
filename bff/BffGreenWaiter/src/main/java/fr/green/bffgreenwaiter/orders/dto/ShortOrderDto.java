package fr.green.bffgreenwaiter.orders.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ShortOrderDto {
    String _id;
    int tableNumber;
    List<MenuItemDto> menuItems;
    String billed;
}
