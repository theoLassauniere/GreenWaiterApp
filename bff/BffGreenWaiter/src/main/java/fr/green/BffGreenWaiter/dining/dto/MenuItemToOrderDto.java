package fr.green.BffGreenWaiter.dining.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuItemToOrderDto {
    String menuItemId;
    String menuItemShortName;
    int howMany;
}
