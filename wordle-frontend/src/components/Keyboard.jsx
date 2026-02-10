import React from 'react';

const Keyboard = ({ onKeyPress, usedLetters }) => {
  const rows = [
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', '⌫']
  ];

  const getKeyColor = (key) => {
    if (!usedLetters[key]) return '#d3d6da';
    
    switch (usedLetters[key]) {
      case 'CORRECT':
        return '#6aaa64';
      case 'PRESENT':
        return '#c9b458';
      case 'ABSENT':
        return '#787c7e';
      default:
        return '#d3d6da';
    }
  };

  const keyStyle = (key) => ({
    padding: '15px',
    margin: '3px',
    border: 'none',
    borderRadius: '4px',
    fontSize: key === 'ENTER' || key === '⌫' ? '12px' : '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: getKeyColor(key),
    color: usedLetters[key] ? '#ffffff' : '#000000',
    minWidth: key === 'ENTER' || key === '⌫' ? '65px' : '43px',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'center', margin: '3px 0' }}>
          {row.map(key => (
            <button
              key={key}
              style={keyStyle(key)}
              onClick={() => onKeyPress(key)}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
