package fr.green.BffGreenWaiter.allergen.controller;

import fr.green.BffGreenWaiter.allergen.service.AllergenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/allergen")
public class AllergenController {
    private final AllergenService allergenService;
    
    @GetMapping("/getAllergen/{id}")
    public List<String> getAllergen(@PathVariable String  id) {
        return allergenService.getAllergensById(id);
    }
}
