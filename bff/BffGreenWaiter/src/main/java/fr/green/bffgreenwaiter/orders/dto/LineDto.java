package fr.green.bffgreenwaiter.orders.dto;

import lombok.Getter;

@Getter
public class LineDto {
    private MenuItemDto item;
    private boolean sentForPreparation;
}
