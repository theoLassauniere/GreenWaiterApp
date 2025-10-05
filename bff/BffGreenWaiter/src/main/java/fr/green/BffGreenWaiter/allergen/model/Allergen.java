package fr.green.BffGreenWaiter.allergen.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;


public class Allergen {

    @JsonProperty("_id")
    private String id;
    private List<String> allergens;

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getAllergens() {
        return allergens;
    }

    public void setAllergens(List<String> allergens) {
        this.allergens = allergens;
    }
}
