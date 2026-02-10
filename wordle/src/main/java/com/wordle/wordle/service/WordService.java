package com.wordle.wordle.service;

import com.wordle.wordle.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;
    private final Random random = new Random();

    public String getRandomWord() {
        List<String> words = wordRepository.findAllActiveWords();
        return words.get(random.nextInt(words.size()));
    }

    public boolean isValidWord(String word) {
        return wordRepository.existsByWordAndIsActiveTrue(word.toUpperCase());
    }
}
