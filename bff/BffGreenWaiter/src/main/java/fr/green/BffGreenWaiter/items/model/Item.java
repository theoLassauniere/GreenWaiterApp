package fr.green.BffGreenWaiter.items.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Item extends ItemRaw {
    private List<String> allergens;

    public Item() {
        super();
    }

    public Item(String _id, String fullName, String shortName, double price, String category, String image, List<String> allergens) {
        super(_id, fullName, shortName, price, category, image);
        this.allergens = allergens;
    }
}
