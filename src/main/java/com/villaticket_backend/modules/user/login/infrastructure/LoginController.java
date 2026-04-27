package com.villaticket_backend.modules.user.login.infrastructure;

import com.villaticket_backend.modules.user.login.application.LoginUser;
import com.villaticket_backend.modules.user.login.domain.LoginRequest;
import com.villaticket_backend.modules.user.login.domain.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private LoginUser loginUser;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = loginUser.execute(request);
        return ResponseEntity.ok(response);
    }
}