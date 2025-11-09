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
}
