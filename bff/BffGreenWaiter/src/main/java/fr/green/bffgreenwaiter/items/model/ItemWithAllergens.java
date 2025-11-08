package fr.green.bffgreenwaiter.items.model;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ItemWithAllergens extends ItemRaw {
    public ItemWithAllergens() {
        super();
    }

    private List<String> allergens;
}
