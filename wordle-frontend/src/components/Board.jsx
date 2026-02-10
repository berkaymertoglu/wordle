import React from 'react';
import Row from './Row';

const Board = ({ guesses, results }) => {
  const rows = [];
  
  for (let i = 0; i < 6; i++) {
    rows.push(
      <Row 
        key={i}
        guess={guesses[i]}
        result={results[i]}
      />
    );
  }

  return (
    <div style={{ margin: '20px 0' }}>
      {rows}
    </div>
  );
};

export default Board;
