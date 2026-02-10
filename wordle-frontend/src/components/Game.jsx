import React, { useState, useEffect } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';
import Header from './Header';
import HelpModal from './HelpModal';
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
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  // Klavye tuşlarını dinle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || showHelp || showStats) return;

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
  }, [gameOver, currentGuess, gameId, guesses, results, usedLetters, showHelp, showStats]);

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
      setMessage('');
      setUsedLetters({});
      setAttemptsLeft(data.attemptsLeft);
      setCorrectWord(null);
      setShowMessage(false);
    } catch (error) {
      displayMessage('Oyun başlatılamadı: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const displayMessage = (text, type = 'info') => {
    setMessage(text);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const handleKeyPress = async (key) => {
    if (gameOver || loading) return;

    if (key === 'ENTER') {
        if (currentGuess.length !== 5) {
            displayMessage('Kelime 5 harfli olmalı!', 'error');
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
          displayMessage('Tebrikler! 🎉', 'success');
        } else if (result.gameOver) {
          setGameOver(true);
          displayMessage('Oyun bitti!', 'error');
        }
        
        setCurrentGuess('');
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        displayMessage(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    } else if (key === 'BACK' || key === '⌫') {
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
    <div className="App">
      <Header 
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
      />
      
      {showMessage && (
        <div className={`message ${won ? 'success' : gameOver ? 'error' : ''}`}>
          {message}
        </div>
      )}

      <div className="game-container">
        <Board guesses={displayGuesses} results={results} />
        
        {gameOver && (
          <div className={`result-box ${won ? 'win' : 'lose'}`}>
            {won ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Tebrikler!</div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>
                  {6 - attemptsLeft}/6 denemede buldunuz
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>😔</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Oyun Bitti!</div>
                {correctWord && (
                  <div className="correct-word">{correctWord}</div>
                )}
              </>
            )}
            <button 
              className="new-game-button"
              onClick={initGame}
              disabled={loading}
            >
              {loading ? 'Yükleniyor...' : 'Yeni Oyun'}
            </button>
          </div>
        )}
        
        <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      {showStats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">İstatistikler</h2>
              <button className="modal-close" onClick={() => setShowStats(false)}>✕</button>
            </div>
            <div className="modal-content">
              <p style={{ textAlign: 'center', padding: '40px', color: '#818384' }}>
                İstatistikler yakında eklenecek...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
