import React from 'react';
import Cell from './Cell';

const Row = ({ guess, result }) => {
  const cells = [];
  
  for (let i = 0; i < 5; i++) {
    const letter = guess ? guess[i] : '';
    const status = result && result[i] ? result[i].status : null;
    
    cells.push(
      <Cell 
        key={i} 
        letter={letter} 
        status={status}
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {cells}
    </div>
  );
};

export default Row;
