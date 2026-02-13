package com.Shubhvivah.support;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class SupportFileStorageService {

    private static final String UPLOAD_DIR = "uploads/support/";

    public String store(MultipartFile file) throws IOException {

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(UPLOAD_DIR + fileName);

        file.transferTo(dest);

        return "/uploads/support/" + fileName;
    }
}
