package fr.green.bffgreenwaiter.items.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum FoodCategory {
    STARTER,
    MAIN,
    DESSERT,
    DRINK;

    @JsonCreator
    public static FoodCategory fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("FoodCategory cannot be null");
        }
        try {
            return FoodCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid FoodCategory: " + value);
        }
    }

}
