package fr.green.kitchen.dto;

import java.util.List;

public class OrderDto {
    String id;
    int tableNumber;
    String shouldBeReadyAt;
    String completedAt;
    String takenForServiceAt;
    List<PreparedItemDto> preparedItems;
}
