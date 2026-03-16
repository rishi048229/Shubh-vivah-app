package com.example.shubhvivah.Support.Service.impl;

import com.example.shubhvivah.Support.Service.SupportFileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class SupportFileStorageServiceImpl implements SupportFileStorageService {

    private static final String UPLOAD_DIR = "uploads/support/";

    @Override
    public String store(MultipartFile file) throws Exception {

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists())
            dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(UPLOAD_DIR + fileName);

        file.transferTo(dest);

        return "/uploads/support/" + fileName;
    }
}