package com.wordle.wordle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LetterResult {

    private char letter;

    private LetterStatus status;

    public enum LetterStatus {
        CORRECT,
        PRESENT,
        ABSENT
    }
}
