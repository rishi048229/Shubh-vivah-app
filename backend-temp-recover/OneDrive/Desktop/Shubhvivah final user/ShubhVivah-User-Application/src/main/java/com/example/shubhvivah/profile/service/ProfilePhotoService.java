package com.example.shubhvivah.profile.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProfilePhotoService {

    void uploadPhotos(Long userId,
            MultipartFile mainPhoto,
            List<MultipartFile> extraPhotos);

    void updateMainPhoto(Long userId, MultipartFile file);

    void deleteMainPhoto(Long userId);

    void deleteExtraPhoto(Long userId, Long photoId);

    void updateExtraPhoto(Long userId,
            Long photoId,
            MultipartFile file);
}