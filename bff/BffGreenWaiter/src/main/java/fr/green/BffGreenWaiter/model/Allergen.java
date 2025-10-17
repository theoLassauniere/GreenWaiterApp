package fr.green.BffGreenWaiter.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Allergen {
    private String name;
    private List<String> allergens;

}
