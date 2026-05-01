package com.villaticket_backend.shared.infraestructure.upload;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapea la ruta web "/uploads/..." a la carpeta física "uploads/" de tu ordenador
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}