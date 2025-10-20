package fr.green.bffgreenwaiter.items.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.green.bffgreenwaiter.items.model.Allergen;
import fr.green.bffgreenwaiter.items.model.GroupMenu;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class GroupMenuService {

    @Value("${menu.file.name}")
    private String menuFileName;

    private GroupMenu menuCache;

    @PostConstruct
    public void init() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getClassLoader().getResourceAsStream(menuFileName);
        menuCache = mapper.readValue(is, new TypeReference<>() {
        });
    }

    public GroupMenu getMenu() {
        return menuCache;
    }
}
