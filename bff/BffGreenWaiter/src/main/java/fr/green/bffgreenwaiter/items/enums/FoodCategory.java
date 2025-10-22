package fr.green.bffgreenwaiter.items.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum FoodCategory {
    STARTER("Entrées"),
    MAIN_COURSE("Plats"),
    DESSERT("Desserts"),
    DRINK("Boissons");

    private final String label;

    FoodCategory(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static FoodCategory fromLabel(String label) {
        for (FoodCategory category : values()) {
            if (category.label.equalsIgnoreCase(label)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown label: " + label);
    }
}
