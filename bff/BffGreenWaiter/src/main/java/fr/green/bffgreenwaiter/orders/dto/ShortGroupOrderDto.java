package fr.green.bffgreenwaiter.orders.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ShortGroupOrderDto {
    int tableNumber;
    List<MenuItemToOrderDto> groupMenuItems;
    List<MenuItemToOrderDto> groupMenuExtras;
    String billed;
}
