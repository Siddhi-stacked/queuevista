package com.queuevista;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * QueueVistaApplication is the entry point for the Spring Boot backend.
 * Viva Explanation:
 * The @SpringBootApplication annotation enables auto-configuration, component scanning,
 * and Spring Boot configuration in one place, bootstrapping the embedded Tomcat server on port 8080.
 */
@SpringBootApplication
public class QueueVistaApplication {

    public static void main(String[] args) {
        SpringApplication.run(QueueVistaApplication.class, args);
    }
}