package com.wordle.wordle.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "words")
@Data
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 5)
    private String word;

    @Column(nullable = false)
    private boolean isTarget = true;  // Hedef kelime olabilir mi?

    @Column(nullable = false)
    private int length = 5;  // Kelime uzunluğu

    @Column(nullable = false)
    private boolean isActive = true;  // Aktif mi?
}

