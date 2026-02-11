package com.Shubhvivah.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class Util {

    // ===============================
    // JWT CONFIG
    // ===============================
    private static final long JWT_EXPIRY = 365L * 24 * 60 * 60 * 1000; // 1 year


    /**
     * IMPORTANT:
     * - Key must be at least 256 bits for HS256
     * - Keep this SAFE (env variable in real projects)
     */
    private static final Key JWT_KEY = Keys.hmacShaKeyFor(
            "shubhvivah_super_secret_key_which_is_very_secure_256bit"
                    .getBytes());

    // ===============================
    // OTP GENERATION
    // ===============================
    public static String generateOtp() {
        int otp = 100000 + (int) (Math.random() * 900000);
        return String.valueOf(otp);
    }

    // ===============================
    // JWT GENERATION
    // ===============================
    public static String generateJwt(Long userId) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRY))
                .signWith(JWT_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // ===============================
    // JWT VALIDATION / EXTRACTION
    // ===============================
    public static Long extractUserId(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    // ===============================
    // JWT VALIDATION
    // ===============================
    public static boolean isTokenValid(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(JWT_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date exp = claims.getExpiration();
            return exp != null && exp.after(new Date());
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
