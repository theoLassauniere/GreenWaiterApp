package fr.green.BffGreenWaiter.service.item;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.green.BffGreenWaiter.model.Allergen;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AllergenService {
    private Map<String, List<String>> allergenCache;

    @PostConstruct
    public void init() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream("allergen.json");
        List<Allergen> entries = mapper.readValue(is, new TypeReference<List<Allergen>>() {});
        allergenCache = entries.stream()
                .collect(Collectors.toMap(Allergen::getName, Allergen::getAllergens));
    }

    public List<String> getAllergensByName(String name) {
        return allergenCache.getOrDefault(name, List.of());
    }
}
