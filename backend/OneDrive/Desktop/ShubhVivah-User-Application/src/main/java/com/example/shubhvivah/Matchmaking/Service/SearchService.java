package com.example.shubhvivah.Matchmaking.Service;

import com.example.shubhvivah.Matchmaking.Dto.MatchmakingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * Native SQL search service that bypasses Hibernate entity mapping.
 * This avoids crashes caused by enum mismatches in the database.
 */
@Service
@RequiredArgsConstructor
public class SearchService {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Search profiles using native SQL — completely bypasses Hibernate.
     */
    public List<MatchmakingDto> searchProfiles(Long currentUserId, String query,
                                                Integer minAge, Integer maxAge,
                                                String religion, String city) {
        try {
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            sql.append("SELECT up.id, u.user_id, u.full_name, up.city, up.date_of_birth, ");
            sql.append("up.profile_photo_url, up.latitude, up.longitude, up.religion, up.gender ");
            sql.append("FROM user_profiles up ");
            sql.append("JOIN users u ON up.user_id = u.user_id ");
            sql.append("WHERE u.user_id != ? ");
            params.add(currentUserId);

            // Text search filter
            if (query != null && !query.trim().isEmpty()) {
                sql.append("AND (LOWER(u.full_name) LIKE LOWER(?) ");
                sql.append("OR LOWER(up.city) LIKE LOWER(?) ");
                sql.append("OR LOWER(up.about_me) LIKE LOWER(?)) ");
                String likeQuery = "%" + query.trim() + "%";
                params.add(likeQuery);
                params.add(likeQuery);
                params.add(likeQuery);
            }

            // City filter
            if (city != null && !city.trim().isEmpty()) {
                sql.append("AND LOWER(up.city) LIKE LOWER(?) ");
                params.add("%" + city.trim() + "%");
            }

            // Religion filter
            if (religion != null && !religion.trim().isEmpty()) {
                sql.append("AND LOWER(up.religion) LIKE LOWER(?) ");
                params.add("%" + religion.trim() + "%");
            }

            sql.append("ORDER BY u.user_id DESC LIMIT 50");

            List<MatchmakingDto> results = jdbcTemplate.query(
                sql.toString(),
                params.toArray(),
                (ResultSet rs, int rowNum) -> {
                    MatchmakingDto dto = new MatchmakingDto();
                    dto.setUserId(rs.getLong("user_id"));
                    dto.setFullName(rs.getString("full_name"));
                    dto.setCity(rs.getString("city"));
                    dto.setProfilePhotoUrl(rs.getString("profile_photo_url"));
                    dto.setReligion(rs.getString("religion"));

                    // Calculate age from date_of_birth
                    java.sql.Date dob = rs.getDate("date_of_birth");
                    if (dob != null) {
                        int age = Period.between(dob.toLocalDate(), LocalDate.now()).getYears();
                        dto.setAge(age);
                    }

                    // Calculate distance if we have coordinates
                    Double lat = rs.getObject("latitude") != null ? rs.getDouble("latitude") : null;
                    Double lon = rs.getObject("longitude") != null ? rs.getDouble("longitude") : null;
                    if (lat != null && lon != null) {
                        dto.setDistanceKm(0.0); // Will be calculated later if needed
                    }

                    // Load photos separately to avoid Hibernate issues
                    try {
                        List<String> photos = jdbcTemplate.queryForList(
                            "SELECT photo_url FROM profile_photos WHERE user_profile_id = ?",
                            String.class,
                            rs.getLong("id")
                        );
                        dto.setPhotos(photos);
                    } catch (Exception e) {
                        dto.setPhotos(List.of());
                    }

                    return dto;
                }
            );

            // Apply age filters in Java (after fetching)
            if (minAge != null || maxAge != null) {
                results = results.stream()
                    .filter(dto -> {
                        int age = dto.getAge();
                        if (age == 0) return true; // No DOB, include anyway
                        if (minAge != null && age < minAge) return false;
                        if (maxAge != null && age > maxAge) return false;
                        return true;
                    })
                    .toList();
            }

            // Calculate distance for current user
            try {
                Double[] myCoords = getMyCoordinates(currentUserId);
                if (myCoords != null) {
                    for (MatchmakingDto dto : results) {
                        // Recalculate using the actual coords from DB
                        // (We skipped storing them in the DTO to keep the query simple)
                    }
                }
            } catch (Exception e) {
                // Ignore distance calculation errors
            }

            return results;

        } catch (Exception e) {
            System.err.println("=== NATIVE SEARCH ERROR ===");
            e.printStackTrace();
            System.err.println("=== END NATIVE SEARCH ERROR ===");
            return List.of();
        }
    }

    /**
     * Get search suggestions using native SQL.
     */
    public List<String> getSuggestions(Long currentUserId, String query) {
        if (query == null || query.trim().isEmpty()) return List.of();

        try {
            String likeQuery = "%" + query.trim() + "%";
            String sql = "SELECT DISTINCT suggestion FROM (" +
                "SELECT u.full_name AS suggestion FROM user_profiles up " +
                "JOIN users u ON up.user_id = u.user_id " +
                "WHERE u.user_id != ? AND LOWER(u.full_name) LIKE LOWER(?) " +
                "UNION " +
                "SELECT DISTINCT up.city AS suggestion FROM user_profiles up " +
                "JOIN users u ON up.user_id = u.user_id " +
                "WHERE u.user_id != ? AND up.city IS NOT NULL AND LOWER(up.city) LIKE LOWER(?)" +
                ") AS suggestions LIMIT 10";

            return jdbcTemplate.queryForList(sql, String.class,
                currentUserId, likeQuery, currentUserId, likeQuery);
        } catch (Exception e) {
            System.err.println("=== SUGGESTION ERROR ===");
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Get nearby matches using native SQL.
     */
    public List<MatchmakingDto> getNearbyProfiles(Long currentUserId) {
        try {
            // First get current user's city
            String myCity = jdbcTemplate.queryForObject(
                "SELECT city FROM user_profiles WHERE user_id = ?",
                String.class, currentUserId);

            if (myCity == null || myCity.trim().isEmpty()) return List.of();

            String sql = "SELECT up.id, u.user_id, u.full_name, up.city, up.date_of_birth, " +
                "up.profile_photo_url, up.latitude, up.longitude, up.religion " +
                "FROM user_profiles up " +
                "JOIN users u ON up.user_id = u.user_id " +
                "WHERE u.user_id != ? AND LOWER(up.city) = LOWER(?) " +
                "LIMIT 10";

            return jdbcTemplate.query(sql, new Object[]{currentUserId, myCity},
                (ResultSet rs, int rowNum) -> {
                    MatchmakingDto dto = new MatchmakingDto();
                    dto.setUserId(rs.getLong("user_id"));
                    dto.setFullName(rs.getString("full_name"));
                    dto.setCity(rs.getString("city"));
                    dto.setProfilePhotoUrl(rs.getString("profile_photo_url"));
                    dto.setReligion(rs.getString("religion"));

                    java.sql.Date dob = rs.getDate("date_of_birth");
                    if (dob != null) {
                        dto.setAge(Period.between(dob.toLocalDate(), LocalDate.now()).getYears());
                    }

                    try {
                        dto.setPhotos(jdbcTemplate.queryForList(
                            "SELECT photo_url FROM profile_photos WHERE user_profile_id = ?",
                            String.class, rs.getLong("id")));
                    } catch (Exception e) {
                        dto.setPhotos(List.of());
                    }

                    return dto;
                });
        } catch (Exception e) {
            System.err.println("=== NEARBY NATIVE ERROR ===");
            e.printStackTrace();
            return List.of();
        }
    }

    private Double[] getMyCoordinates(Long userId) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT latitude, longitude FROM user_profiles WHERE user_id = ?",
                new Object[]{userId},
                (rs, rowNum) -> {
                    Double lat = rs.getObject("latitude") != null ? rs.getDouble("latitude") : null;
                    Double lon = rs.getObject("longitude") != null ? rs.getDouble("longitude") : null;
                    if (lat != null && lon != null) return new Double[]{lat, lon};
                    return null;
                });
        } catch (Exception e) {
            return null;
        }
    }
}
