package fr.green.BffGreenWaiter.dto.order;

import lombok.Getter;

import java.util.List;

@Getter
public class ShortOrderDto {
    int tableNumber;
    List<MenuItemToOrderDto> menuItems;
    String billed;
}
