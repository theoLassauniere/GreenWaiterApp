package fr.green.BffGreenWaiter.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuItemToOrderDto {
    String menuItemId;
    String menuItemShortName;
    int howMany;
}
