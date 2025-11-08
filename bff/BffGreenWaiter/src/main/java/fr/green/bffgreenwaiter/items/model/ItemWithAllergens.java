package fr.green.bffgreenwaiter.items.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemWithAllergens extends ItemRaw {
    private List<String> allergens;
}
