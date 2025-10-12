package fr.green.BffGreenWaiter.orders.dto;

import lombok.Getter;

@Getter
public class LineDto {
    private ItemDto item;
    private int howMany;
    private boolean sentForPreparation;
}