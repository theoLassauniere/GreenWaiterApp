package fr.green.BffGreenWaiter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"fr.green.BffGreenWaiter", "fr.green.tables"})
public class BffGreenWaiterApplication {
	public static void main(String[] args) {
		SpringApplication.run(BffGreenWaiterApplication.class, args);
	}
}
