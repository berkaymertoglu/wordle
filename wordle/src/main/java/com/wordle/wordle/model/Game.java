package com.wordle.wordle.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String targetWord;      // Tahmin edilecek kelime (örn: "KARGA")

    private int attemptsLeft;       // Kalan deneme hakkı (başta 6)

    private boolean isCompleted;    // Oyun bitti mi?

    private boolean isWon;          // Kazandı mı?

    @ElementCollection
    private List<String> guesses = new ArrayList<>();  // Yapılan tahminler

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        attemptsLeft = 6;
    }
}
