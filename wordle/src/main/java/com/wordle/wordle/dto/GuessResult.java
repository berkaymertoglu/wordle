package com.wordle.wordle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GuessResult {

    private String guess;

    private List<LetterResult> letterResults;

    private boolean isCorrect;

    private int attemptsLeft;

    private boolean gameOver;

    private String correctWord;
}
