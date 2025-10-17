package fr.green.BffGreenWaiter.dto.order;

import lombok.Getter;

import java.util.List;

@Getter
public class OrderLineDto {
    private String _id;
    private int tableNumber;
    private List<LineDto> lines;
}
