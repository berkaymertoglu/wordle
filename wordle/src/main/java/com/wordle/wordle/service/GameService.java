package com.wordle.wordle.service;

import com.wordle.wordle.dto.GuessResult;
import com.wordle.wordle.dto.LetterResult;
import com.wordle.wordle.dto.LetterResult.LetterStatus;
import com.wordle.wordle.model.Game;
import com.wordle.wordle.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameRepository gameRepository;
    private final WordService wordService;

    /**
     * Yeni oyun başlat
     */
    public Game startNewGame() {
        String targetWord = wordService.getRandomWord();

        Game game = new Game();
        game.setTargetWord(targetWord);
        // attemptsLeft ve createdAt @PrePersist ile otomatik ayarlanacak

        Game savedGame = gameRepository.save(game);
        log.info("🎮 Yeni oyun başlatıldı. ID: {}, Kelime: {}", savedGame.getId(), targetWord);

        return savedGame;
    }

    /**
     * Tahmin yap
     */
    public GuessResult makeGuess(Long gameId, String guess) {
        // 1. Oyunu bul
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Oyun bulunamadı!"));

        // 2. Oyun bitti mi kontrol et
        if (game.isCompleted()) {
            throw new RuntimeException("Oyun zaten bitti!");
        }

        // 3. Tahmin hakkı kontrolü
        if (game.getAttemptsLeft() <= 0) {
            throw new RuntimeException("Tahmin hakkınız bitti!");
        }

        // 4. Kelime geçerli mi kontrol et
        guess = guess.toUpperCase();
        if (!wordService.isValidWord(guess)) {
            throw new RuntimeException("Geçersiz kelime!");
        }

        // 5. Tahmin sonucunu hesapla
        List<LetterResult> letterResults = calculateLetterResults(game.getTargetWord(), guess);

        // 6. Oyun durumunu güncelle
        game.getGuesses().add(guess);
        game.setAttemptsLeft(game.getAttemptsLeft() - 1);

        // 7. Kazandı mı kontrol et
        boolean isCorrect = guess.equals(game.getTargetWord());
        if (isCorrect) {
            game.setWon(true);
            game.setCompleted(true);
            game.setCompletedAt(LocalDateTime.now());
            log.info("🎉 Oyun kazanıldı! ID: {}, Kelime: {}", gameId, game.getTargetWord());
        }

        // 8. Tahmin hakkı bitti mi kontrol et
        boolean gameOver = game.getAttemptsLeft() <= 0 || isCorrect;
        if (gameOver && !isCorrect) {
            game.setCompleted(true);
            game.setCompletedAt(LocalDateTime.now());
            log.info("😢 Oyun kaybedildi! ID: {}, Kelime: {}", gameId, game.getTargetWord());
        }

        gameRepository.save(game);

        // 9. Sonucu döndür
        return new GuessResult(
                guess,
                letterResults,
                isCorrect,
                game.getAttemptsLeft(),
                gameOver,
                gameOver ? game.getTargetWord() : null // 👈 Oyun bittiyse doğru kelimeyi göster
        );

    }

    /**
     * Tahmin sonucunu hesapla (Wordle mantığı)
     */
    private List<LetterResult> calculateLetterResults(String targetWord, String guess) {
        List<LetterResult> results = new ArrayList<>();

        // Hedef kelimedeki harflerin sayısını tut
        Map<Character, Integer> targetLetterCount = new HashMap<>();
        for (char c : targetWord.toCharArray()) {
            targetLetterCount.put(c, targetLetterCount.getOrDefault(c, 0) + 1);
        }

        // İlk geçiş: CORRECT (yeşil) harfleri işaretle
        LetterResult[] tempResults = new LetterResult[5];
        for (int i = 0; i < 5; i++) {
            char guessChar = guess.charAt(i);
            char targetChar = targetWord.charAt(i);

            if (guessChar == targetChar) {
                tempResults[i] = new LetterResult(guessChar, LetterStatus.CORRECT);
                targetLetterCount.put(guessChar, targetLetterCount.get(guessChar) - 1);
            }
        }

        // İkinci geçiş: PRESENT (sarı) ve ABSENT (gri) harfleri işaretle
        for (int i = 0; i < 5; i++) {
            if (tempResults[i] != null) {
                results.add(tempResults[i]);
                continue;
            }

            char guessChar = guess.charAt(i);

            if (targetLetterCount.getOrDefault(guessChar, 0) > 0) {
                results.add(new LetterResult(guessChar, LetterStatus.PRESENT));
                targetLetterCount.put(guessChar, targetLetterCount.get(guessChar) - 1);
            } else {
                results.add(new LetterResult(guessChar, LetterStatus.ABSENT));
            }
        }

        return results;
    }

    /**
     * Oyun durumunu getir
     */
    public Game getGame(Long gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Oyun bulunamadı!"));
    }

    /**
     * Oyunu sil
     */
    public void deleteGame(Long gameId) {
        gameRepository.deleteById(gameId);
        log.info("🗑️ Oyun silindi. ID: {}", gameId);
    }
}
