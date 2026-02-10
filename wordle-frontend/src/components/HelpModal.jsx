import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nasıl Oynanır</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <p><strong>6 denemede WORDLE'ı tahmin edin.</strong></p>
          <p>Her tahmin 5 harfli geçerli bir Türkçe kelime olmalıdır. Göndermek için enter tuşuna basın.</p>
          <p>Her tahminden sonra, kutucukların rengi tahmininizin kelimeye ne kadar yakın olduğunu gösterecek şekilde değişecektir.</p>
          
          <div style={{ margin: '20px 0' }}>
            <p><strong>Örnekler:</strong></p>
            <div style={{ display: 'flex', gap: '5px', margin: '10px 0' }}>
              <div className="tile correct" style={{ width: '40px', height: '40px', fontSize: '20px' }}>K</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>A</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>L</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>E</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>M</div>
            </div>
            <p><strong>K</strong> harfi kelimede var ve doğru yerde.</p>

            <div style={{ display: 'flex', gap: '5px', margin: '10px 0' }}>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>B</div>
              <div className="tile present" style={{ width: '40px', height: '40px', fontSize: '20px' }}>A</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>Ş</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>K</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>A</div>
            </div>
            <p><strong>A</strong> harfi kelimede var ama yanlış yerde.</p>

            <div style={{ display: 'flex', gap: '5px', margin: '10px 0' }}>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>K</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>İ</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>T</div>
              <div className="tile absent" style={{ width: '40px', height: '40px', fontSize: '20px' }}>A</div>
              <div className="tile" style={{ width: '40px', height: '40px', fontSize: '20px' }}>P</div>
            </div>
            <p><strong>A</strong> harfi kelimede hiç yok.</p>
          </div>

          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Her gün yeni bir WORDLE!</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
