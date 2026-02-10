package com.wordle.wordle.config;

import com.wordle.wordle.model.Word;
import com.wordle.wordle.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class WordLoader implements CommandLineRunner {

    private final WordRepository wordRepository;

    @Override
    public void run(String... args) throws Exception {
        // Eğer veritabanında kelime varsa tekrar yükleme
        if (wordRepository.count() > 0) {
            log.info("✅ Kelimeler zaten yüklü. Toplam: {}", wordRepository.count());
            return;
        }

        log.info("📥 Kelimeler yükleniyor...");

        try {
            ClassPathResource resource = new ClassPathResource("words.txt");
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)
            );

            Set<String> uniqueWords = new HashSet<>();  // ← Tekrar eden kelimeleri önle
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                String word = line.trim().toUpperCase();

                // Boş satırları atla
                if (word.isEmpty()) {
                    continue;
                }

                // 5 harfli değilse atla
                if (word.length() != 5) {
                    log.warn("⚠️ Satır {}: '{}' 5 harfli değil, atlandı", lineNumber, word);
                    continue;
                }

                // Sadece Türkçe harfler içeriyorsa ekle
                if (word.matches("[A-ZÇĞİÖŞÜ]+")) {
                    uniqueWords.add(word);  // ← Set otomatik tekrarları önler
                } else {
                    log.warn("⚠️ Satır {}: '{}' geçersiz karakter içeriyor, atlandı", lineNumber, word);
                }
            }

            reader.close();

            // Unique kelimeleri veritabanına kaydet
            int savedCount = 0;
            for (String word : uniqueWords) {
                Word wordEntity = new Word();
                wordEntity.setWord(word);
                wordEntity.setActive(true);
                wordRepository.save(wordEntity);
                savedCount++;
            }

            log.info("✅ {} unique kelime başarıyla yüklendi", savedCount);
            log.info("📊 Toplam satır: {}, Unique kelime: {}, Tekrar eden: {}",
                    lineNumber, savedCount, lineNumber - savedCount);

        } catch (Exception e) {
            log.error("❌ Kelime yüklenemedi: {}", e.getMessage());
            throw e;
        }
    }
}
