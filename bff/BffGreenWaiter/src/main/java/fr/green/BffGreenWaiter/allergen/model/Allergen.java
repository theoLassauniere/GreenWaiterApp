package fr.green.BffGreenWaiter.allergen.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Allergen {

    @JsonProperty("_id")
    private String id;
    private List<String> allergens;

}
