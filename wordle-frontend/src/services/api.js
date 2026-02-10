import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/game';

export const startNewGame = async () => {
  const response = await axios.post(`${API_BASE_URL}/start`);
  return response.data;
};

export const makeGuess = async (gameId, guess) => {
  const response = await axios.post(`${API_BASE_URL}/${gameId}/guess`, {
    guess: guess.toUpperCase()
  });
  return response.data;
};

export const getGame = async (gameId) => {
  const response = await axios.get(`${API_BASE_URL}/${gameId}`);
  return response.data;
};
