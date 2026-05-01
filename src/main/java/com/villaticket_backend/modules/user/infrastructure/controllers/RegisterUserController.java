package com.villaticket_backend.modules.user.infrastructure.controllers;

import com.villaticket_backend.modules.user.domain.model.Usuario;
import com.villaticket_backend.modules.user.application.use_cases.RegisterUser;
import com.villaticket_backend.modules.user.application.dtos.RegisterUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class RegisterUserController {

    @Autowired
    private RegisterUser registerUser;

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterUserRequest request) {
        Usuario usuarioCreado = registerUser.run(request);
        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    }
}