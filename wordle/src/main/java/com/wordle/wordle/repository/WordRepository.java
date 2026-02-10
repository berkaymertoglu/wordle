package com.wordle.wordle.repository;

import com.wordle.wordle.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    boolean existsByWordAndIsActiveTrue(String word);

    List<Word> findByIsTargetTrueAndIsActiveTrueAndLength(int length);

    @Query("SELECT w.word FROM Word w WHERE w.isTarget = true AND w.isActive = true AND w.length = 5")
    List<String> findAllActiveWords();
}
