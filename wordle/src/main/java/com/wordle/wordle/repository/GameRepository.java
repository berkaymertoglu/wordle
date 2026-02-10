package com.wordle.wordle.repository;

import com.wordle.wordle.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    Optional<Game> findByIdAndIsCompletedFalse(Long id);
}
