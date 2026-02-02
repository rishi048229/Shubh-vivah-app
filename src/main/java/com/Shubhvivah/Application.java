package com.Shubhvivah;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.Shubhvivah")
@EntityScan(basePackages = "com.Shubhvivah")
@EnableJpaRepositories(basePackages = "com.Shubhvivah")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
