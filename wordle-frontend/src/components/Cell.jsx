import React from 'react';

const Cell = ({ letter, status }) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'CORRECT':
        return '#6aaa64'; // Yeşil
      case 'PRESENT':
        return '#c9b458'; // Sarı
      case 'ABSENT':
        return '#787c7e'; // Gri
      default:
        return '#ffffff'; // Beyaz
    }
  };

  const cellStyle = {
    width: '60px',
    height: '60px',
    border: status ? '2px solid transparent' : '2px solid #d3d6da',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '2px',
    backgroundColor: getBackgroundColor(),
    color: status ? '#ffffff' : '#000000',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase'
  };

  return (
    <div style={cellStyle}>
      {letter}
    </div>
  );
};

export default Cell;
