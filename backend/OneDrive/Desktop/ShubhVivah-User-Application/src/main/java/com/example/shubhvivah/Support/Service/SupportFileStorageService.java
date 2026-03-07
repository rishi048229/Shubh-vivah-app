package com.example.shubhvivah.Support.Service;

import org.springframework.web.multipart.MultipartFile;

public interface SupportFileStorageService {

    String store(MultipartFile file) throws Exception;
}