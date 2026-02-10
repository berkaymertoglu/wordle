import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';
import { startNewGame, makeGuess } from '../services/api';

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({});
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [correctWord, setCorrectWord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  // Klavye tuşlarını dinle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      const key = e.key.toUpperCase();
      const turkishKeys = ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü', 
                          'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ',
                          'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'];

      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('⌫');
      } else if (turkishKeys.includes(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, currentGuess, gameId, guesses, results, usedLetters]);

  const initGame = async () => {
    setLoading(true);
    try {
      const data = await startNewGame();
      setGameId(data.gameId);
      setGuesses([]);
      setResults([]);
      setCurrentGuess('');
      setGameOver(false);
      setWon(false);
      setMessage('5 harfli Türkçe kelimeyi tahmin edin!');
      setUsedLetters({});
      setAttemptsLeft(data.attemptsLeft);
    } catch (error) {
      setMessage('❌ Oyun başlatılamadı: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = async (key) => {
    if (gameOver || loading) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setMessage('⚠️ Kelime 5 harfli olmalı!');
        setTimeout(() => setMessage(`${attemptsLeft} deneme hakkınız kaldı`), 2000);
        return;
      }

      setLoading(true);
      try {
        const result = await makeGuess(gameId, currentGuess);
        
        setGuesses([...guesses, currentGuess]);
        setResults([...results, result.letterResults]);
        setAttemptsLeft(result.attemptsLeft);

        if (result.correctWord) {
            setCorrectWord(result.correctWord);
        }
        
        // Kullanılan harfleri güncelle
        const newUsedLetters = { ...usedLetters };
        result.letterResults.forEach(lr => {
          if (!newUsedLetters[lr.letter] || 
              (newUsedLetters[lr.letter] === 'ABSENT' && lr.status !== 'ABSENT') ||
              (newUsedLetters[lr.letter] === 'PRESENT' && lr.status === 'CORRECT')) {
            newUsedLetters[lr.letter] = lr.status;
          }
        });
        setUsedLetters(newUsedLetters);
        
        if (result.correct) {
          setGameOver(true);
          setWon(true);
          setMessage('🎉 Tebrikler! Doğru kelimeyi buldunuz!');
        } else if (result.gameOver) {
          setGameOver(true);
          setMessage('😔 Oyun bitti! Yeni oyun için butona tıklayın.');
        } else {
          setMessage(`${result.attemptsLeft} deneme hakkınız kaldı`);
        }
        
        setCurrentGuess('');
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        setMessage('❌ ' + errorMsg);
        setTimeout(() => setMessage(`${attemptsLeft} deneme hakkınız kaldı`), 3000);
      } finally {
        setLoading(false);
      }
    } else if (key === '⌫') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const displayGuesses = [...guesses];
  if (currentGuess && !gameOver) {
    displayGuesses.push(currentGuess);
  }

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      fontFamily: "'Clear Sans', 'Helvetica Neue', Arial, sans-serif",
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '36px', 
        fontWeight: 'bold',
        borderBottom: '1px solid #d3d6da',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        🎮 WORDLE TÜRKÇE
      </h1>
      
      <div style={{ 
        backgroundColor: won ? '#6aaa64' : gameOver ? '#787c7e' : '#f0f0f0',
        color: gameOver ? '#ffffff' : '#000000',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px auto',
        fontWeight: 'bold',
        fontSize: '16px',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {loading ? '⏳ Yükleniyor...' : message}
      </div>

      <div style={{ 
        fontSize: '18px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: attemptsLeft <= 2 ? '#e63946' : '#000000'
      }}>
        📊 Kalan Deneme: {attemptsLeft}/6
      </div>

      <Board guesses={displayGuesses} results={results} />
      
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />

      {gameOver && !won && correctWord && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '2px solid #f5c6cb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          😢 Doğru kelime: <span style={{ 
            color: '#155724', 
            backgroundColor: '#d4edda',
            padding: '5px 15px',
            borderRadius: '5px',
            fontSize: '24px'
          }}>{correctWord}</span>
        </div>
      )}
      
      {gameOver && (
        <button
          onClick={initGame}
          disabled={loading}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: loading ? '#cccccc' : '#6aaa64',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a9a55')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#6aaa64')}
        >
          {loading ? '⏳ Yükleniyor...' : '🔄 Yeni Oyun Başlat'}
        </button>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <p><strong>Nasıl Oynanır?</strong></p>
        <p>🟩 Yeşil: Harf doğru yerde</p>
        <p>🟨 Sarı: Harf var ama yanlış yerde</p>
        <p>⬜ Gri: Harf kelimede yok</p>
      </div>
    </div>
  );
};

export default Game;
