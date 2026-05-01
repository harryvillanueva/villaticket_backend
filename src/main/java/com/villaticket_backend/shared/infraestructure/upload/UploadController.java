package com.villaticket_backend.shared.infraestructure.upload;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Nombre de la carpeta en la raíz de tu proyecto donde se guardarán las fotos
    private final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío");
        }

        try {
            // 1. Crear la carpeta "uploads" si no existe
            File directorio = new File(UPLOAD_DIR);
            if (!directorio.exists()) {
                directorio.mkdirs();
            }

            // 2. Generar un nombre único para evitar que fotos con el mismo nombre se sobreescriban
            String nombreUnico = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
            Path rutaDestino = Paths.get(UPLOAD_DIR + nombreUnico);

            // 3. Copiar el archivo físicamente al servidor
            Files.copy(file.getInputStream(), rutaDestino);

            // 4. Devolver la URL estática que usará el frontend
            return ResponseEntity.ok("/uploads/" + nombreUnico);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir el archivo");
        }
    }
}