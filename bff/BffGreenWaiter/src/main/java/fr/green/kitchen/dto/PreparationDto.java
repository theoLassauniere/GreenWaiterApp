package fr.green.kitchen.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class PreparationDto {
    int tableNumber;
    List<MenuItemShortDto> itemsToBeCooked;
}
