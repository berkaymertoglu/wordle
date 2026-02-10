package com.wordle.wordle.controller;

import com.wordle.wordle.dto.GuessResult;
import com.wordle.wordle.model.Game;
import com.wordle.wordle.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;

    /**
     * ⚠️ ÖNEMLİ: Bu endpoint EN ÜSTTE OLMALI!
     * Yeni oyun başlat
     * POST /api/game/start
     */
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startGame() {
        Game game = gameService.startNewGame();

        return ResponseEntity.ok(Map.of(
                "gameId", game.getId(),
                "attemptsLeft", game.getAttemptsLeft(),
                "message", "Yeni oyun başlatıldı!"
        ));
    }

    /**
     * Tahmin yap
     * POST /api/game/{gameId}/guess
     */
    @PostMapping("/{gameId}/guess")
    public ResponseEntity<?> makeGuess(
            @PathVariable Long gameId,
            @RequestBody Map<String, String> request) {

        String guess = request.get("guess");

        if (guess == null || guess.length() != 5) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Tahmin 5 harfli olmalı!"));
        }

        try {
            GuessResult result = gameService.makeGuess(gameId, guess);
            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Oyun durumunu getir
     * GET /api/game/{gameId}
     *
     * ⚠️ Bu endpoint EN ALTTA OLMALI!
     */
    @GetMapping("/{gameId}")
    public ResponseEntity<Game> getGame(@PathVariable Long gameId) {
        try {
            Game game = gameService.getGame(gameId);
            return ResponseEntity.ok(game);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Oyunu sil
     * DELETE /api/game/{gameId}
     */
    @DeleteMapping("/{gameId}")
    public ResponseEntity<Map<String, String>> deleteGame(@PathVariable Long gameId) {
        gameService.deleteGame(gameId);
        return ResponseEntity.ok(Map.of("message", "Oyun silindi"));
    }
}
