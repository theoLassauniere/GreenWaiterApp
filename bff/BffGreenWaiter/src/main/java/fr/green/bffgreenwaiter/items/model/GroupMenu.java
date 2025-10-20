package fr.green.bffgreenwaiter.items.model;


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
    private String _id;
    private String name;
    private double price;
    private Map<String, List<Item>> itemsByCategory;
}
