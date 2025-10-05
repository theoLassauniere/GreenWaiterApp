package fr.green.BffGreenWaiter.allergen.controller;

import fr.green.BffGreenWaiter.allergen.service.AllergenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/allergen")
public class AllergenController {
    @Autowired
    private AllergenService allergenService;

    public AllergenController() {}

    @GetMapping("/getAllergen/{id}")
    public List<String> getAllergen(@PathVariable String  id) {
        return allergenService.getAllergensById(id);
    }
}
