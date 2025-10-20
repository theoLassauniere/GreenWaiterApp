package fr.green.bffgreenwaiter.orders.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class OrderLineDto {
    private String _id;
    private int tableNumber;
    private List<LineDto> lines;
}
