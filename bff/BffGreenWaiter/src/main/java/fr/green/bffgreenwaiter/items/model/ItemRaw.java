package fr.green.bffgreenwaiter.items.model;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemRaw {
    private String _id;
    private String fullName;
    private String shortName;
    private double price;
    private String category;
    private String image;
}
