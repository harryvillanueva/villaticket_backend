package com.villaticket_backend.modules.user.register_user.infrastructure;

import com.villaticket_backend.modules.user.domain.model.Usuario;
import com.villaticket_backend.modules.user.register_user.application.RegisterUser;
import com.villaticket_backend.modules.user.register_user.domain.RegisterUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class RegisterUserController {

    @Autowired
    private  RegisterUser registerUser; // Inyectamos el Caso de Uso

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterUserRequest request) {
        Usuario usuarioCreado = registerUser.run(request);
        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    }
}