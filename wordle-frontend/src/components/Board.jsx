import React from 'react';

const Board = ({ guesses, results }) => {
  const rows = 6;
  const cols = 5;

  const renderTile = (rowIndex, colIndex) => {
    const guess = guesses[rowIndex] || '';
    const letter = guess[colIndex] || '';
    const result = results[rowIndex];
    
    let className = 'tile';
    
    if (letter) {
      className += ' filled';
    }
    
    if (result && result[colIndex]) {
      const status = result[colIndex].status.toLowerCase();
      className += ` ${status}`;
    }
    
    return (
      <div key={colIndex} className={className}>
        {letter}
      </div>
    );
  };

  const renderRow = (rowIndex) => {
    return (
      <div key={rowIndex} className="board-row">
        {[...Array(cols)].map((_, colIndex) => renderTile(rowIndex, colIndex))}
      </div>
    );
  };

  return (
    <div className="board">
      {[...Array(rows)].map((_, rowIndex) => renderRow(rowIndex))}
    </div>
  );
};

export default Board;
