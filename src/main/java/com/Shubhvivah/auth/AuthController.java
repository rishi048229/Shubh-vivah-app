package com.Shubhvivah.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody AuthDto dto) {
        authService.sendOtp(dto);
        return "OTP sent ✅ ";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody AuthDto dto) {
        authService.verifyOtp(dto);
        return "OTP verified ✅";
    }

    @PostMapping("/set-password")
    public String setPassword(@RequestBody AuthDto dto) {
        authService.setPassword(dto);
        return "Password set";
    }

    @PostMapping("/login")
    public AuthDto login(@RequestBody AuthDto dto) {
    
        String token = authService.login(dto);
    
        dto.setToken(token);
        dto.setPassword(null);
    
        return dto;
    }
    

    // ------RESET PASSWORD API------

    @PostMapping("/forgotpassword")
    public String forgotpassotp(@RequestBody AuthDto dto) {
        authService.sendForgotPasswordOtp(dto);
        return "Otp sent ✅";
    }

    @PostMapping("/resetpassotp")
    public String verifyforgotpassotp(@RequestBody AuthDto dto) {
        authService.verifyForgotPasswordOtp(dto);

        return "Otp verified ✅ ";
    }

    @PostMapping("/resetpassword")
    public String resetpassmeth(@RequestBody AuthDto dto) {
        authService.resetPassword(dto);
        return "Password reset successfully";

    }

    // HELPER - Generate a valid token for testing
    @GetMapping("/generate-test-token/{userId}")
    public String generateTestToken(@PathVariable Long userId) {
        return com.Shubhvivah.common.Util.generateJwt(userId);
    }
    @PostMapping("/auth/logout")
public void logout() {}

}
