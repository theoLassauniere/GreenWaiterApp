package fr.green.bffgreenwaiter.items.mapper;

import fr.green.bffgreenwaiter.items.model.ItemWithAllergens;
import fr.green.bffgreenwaiter.items.model.ItemRaw;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {

    public ItemWithAllergens toItem(ItemRaw raw) {
        if (raw == null) return null;
        ItemWithAllergens itemWithAllergens = new ItemWithAllergens();
        itemWithAllergens.set_id(raw.get_id());
        itemWithAllergens.setFullName(raw.getFullName());
        itemWithAllergens.setShortName(raw.getShortName());
        itemWithAllergens.setPrice(raw.getPrice());
        itemWithAllergens.setCategory(raw.getCategory());
        itemWithAllergens.setImage(raw.getImage());
        return itemWithAllergens;
    }
}
