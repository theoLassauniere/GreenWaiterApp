package fr.green.bffgreenwaiter.items.model;


import fr.green.bffgreenwaiter.items.enums.FoodCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GroupMenu {
    private String name;
    private double price;
    private Map<FoodCategory, List<Item>> itemsByCategory;
}
