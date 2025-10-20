package fr.green.bffgreenwaiter.items.mapper;

import fr.green.bffgreenwaiter.items.model.Item;
import fr.green.bffgreenwaiter.items.model.ItemRaw;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {

    public Item toItem(ItemRaw raw) {
        if (raw == null) return null;

        Item item = new Item();
        item.set_id(raw.get_id());
        item.setFullName(raw.getFullName());
        item.setShortName(raw.getShortName());
        item.setPrice(raw.getPrice());
        item.setCategory(raw.getCategory());
        item.setImage(raw.getImage());
        return item;
    }
}
