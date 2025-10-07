package fr.green.dining.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ShortOrderDto {
    int tableNumber;
    List<MenuItemToOrderDto> menuItems;
}
