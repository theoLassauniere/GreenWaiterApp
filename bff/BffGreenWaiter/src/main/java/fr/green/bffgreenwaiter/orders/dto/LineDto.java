package fr.green.bffgreenwaiter.orders.dto;

import lombok.Getter;

@Getter
public class LineDto {
    private ShortItemDto item;
    private int howMany;
    private boolean sentForPreparation;
}
