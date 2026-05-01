package com.villaticket_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.villaticket_backend")
@EnableJpaRepositories(basePackages = "com.villaticket_backend.modules.*.infrastructure.persistence.jpa")
@EntityScan(basePackages = "com.villaticket_backend.modules.*.infrastructure.persistence.entities")
public class VillaticketBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VillaticketBackendApplication.class, args);
	}

}
