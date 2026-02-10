package com.wordle.wordle.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "🎮 Wordle Game API - Çalışıyor!";
    }

    @GetMapping("/health")
    public String health() {
        return "✅ Server is running!";
    }
}
