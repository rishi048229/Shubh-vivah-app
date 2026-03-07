package com.example.shubhvivah.profile.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // =====================================================
    // UPLOAD IMAGE
    // =====================================================

    public String uploadFile(MultipartFile file) {
        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "shubhvivah/profile",
                            "resource_type", "image"));

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    // =====================================================
    // DELETE IMAGE
    // =====================================================

    public void deleteFile(String imageUrl) {
        try {

            String publicId = extractPublicId(imageUrl);

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary delete failed: " + e.getMessage(), e);
        }
    }

    // =====================================================
    // HELPER METHOD
    // =====================================================

    /**
     * Converts Cloudinary URL → publicId
     *
     * Example:
     * https://res.cloudinary.com/demo/image/upload/v123/shubhvivah/profile/abc.jpg
     *
     * becomes:
     * shubhvivah/profile/abc
     */
    private String extractPublicId(String imageUrl) {

        String[] parts = imageUrl.split("/upload/");
        String path = parts[1];

        // remove version (v123456/)
        path = path.replaceAll("v\\d+/", "");

        // remove extension
        return path.substring(0, path.lastIndexOf("."));
    }
}