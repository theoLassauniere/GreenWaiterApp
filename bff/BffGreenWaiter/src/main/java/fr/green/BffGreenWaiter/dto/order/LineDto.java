package fr.green.BffGreenWaiter.dto.order;

import lombok.Getter;

@Getter
public class LineDto {
    private ShortItemDto item;
    private int howMany;
    private boolean sentForPreparation;
}