import React, { useState, useEffect, useRef } from 'react';

// קומפוננטה להצגת הנתונים בתצוגה טקסטואלית (3 עיגולים עם ערכים)
function TextDisplay({ alt, his, adi }) {
  const circleStyle = {
    width: '80px', height: '80px',
    borderRadius: '50%', border: '2px solid black',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    margin: '5px'
  };
  const labelStyle = { fontSize: '12px', fontWeight: 'bold' };
  const valueStyle = { fontSize: '14px' };

  return (
    <div className="text-display" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
      <div className="circle altitude-circle" style={circleStyle}>
        <div className="circle-label" style={labelStyle}>Altitude</div>
        <div className="circle-value" style={valueStyle}>{alt}</div>
      </div>
      <div className="circle his-circle" style={circleStyle}>
        <div className="circle-label" style={labelStyle}>HIS</div>
        <div className="circle-value" style={valueStyle}>{his}</div>
      </div>
      <div className="circle adi-circle" style={circleStyle}>
        <div className="circle-label" style={labelStyle}>ADI</div>
        <div className="circle-value" style={valueStyle}>{adi}</div>
      </div>
    </div>
  );
}

// קומפוננטה להצגת הנתונים בתצוגה ויזואלית
function VisualDisplay({ alt, his, adi }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textBaseline = 'middle';

    const altMin = 0, altMax = 3000;
    const topMargin = 20, bottomMargin = 20;
    const altRegionWidth = 60;
    const gaugeX = 20;
    const barWidth = 10;
    const gaugeBottomY = height - bottomMargin;
    const gaugeTopY = topMargin;
    const gaugeHeight = gaugeBottomY - gaugeTopY;
    const altScale = gaugeHeight / (altMax - altMin);

    ctx.fillStyle = 'black';
    for (let value = altMin; value <= altMax; value += 1000) {
      const y = gaugeBottomY - (value - altMin) * altScale;
      ctx.beginPath();
      ctx.moveTo(gaugeX + barWidth, y);
      ctx.lineTo(gaugeX + barWidth + 5, y);
      ctx.stroke();
      ctx.fillText(value.toString(), gaugeX + barWidth + 7, y);
    }

    const altValue = Math.max(altMin, Math.min(altMax, alt));
    const altValueY = gaugeBottomY - (altValue - altMin) * altScale;
    ctx.fillStyle = 'blue';
    ctx.fillRect(gaugeX, altValueY, barWidth, gaugeBottomY - altValueY);

    const compassRegionX = altRegionWidth;
    const compassRegionWidth = 120;
    const centerX = compassRegionX + compassRegionWidth / 2;
    const centerY = height / 2;
    const radius = 50;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-his * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(0, -radius + 10);
    ctx.moveTo(radius, 0);
    ctx.lineTo(radius - 10, 0);
    ctx.moveTo(0, radius);
    ctx.lineTo(0, radius - 10);
    ctx.moveTo(-radius, 0);
    ctx.lineTo(-radius + 10, 0);
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText('N', -5, -radius + 15);
    ctx.fillText('E', radius - 15, -5);
    ctx.fillText('S', -3, radius - 15);
    ctx.fillText('W', -radius + 10, -5);
    ctx.restore();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - (radius - 5));
    ctx.lineTo(centerX - 5, centerY - (radius - 15));
    ctx.lineTo(centerX + 5, centerY - (radius - 15));
    ctx.closePath();
    ctx.fill();

    const adiRegionX = compassRegionX + compassRegionWidth;
    const adiRegionWidth = width - adiRegionX;
    const adiCenterX = adiRegionX + adiRegionWidth / 2;
    const adiCenterY = height / 2;
    const adiRadius = 40;
    let adiColor;
    if (adi > 0) adiColor = 'green';
    else if (adi < 0) adiColor = 'red';
    else adiColor = 'blue';
    ctx.beginPath();
    ctx.arc(adiCenterX, adiCenterY, adiRadius, 0, 2 * Math.PI);
    ctx.fillStyle = adiColor;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }, [alt, his, adi]);

  return <canvas ref={canvasRef} width="300" height="300" style={{ margin: '10px 0', border: '1px solid lightgray' }} />;
}

function InstrumentPanel({ mode }) {
  const [alt, setAlt] = useState(0);
  const [his, setHis] = useState(0);
  const [adi, setAdi] = useState(0);

  const handleAltChange = (e) => {
    const val = Number(e.target.value);
    setAlt(val < 0 ? 0 : val > 3000 ? 3000 : val);
  };
  const handleHisChange = (e) => {
    const val = Number(e.target.value);
    setHis(val < 0 ? 0 : val > 360 ? 360 : val);
  };
  const handleAdiChange = (e) => {
    const val = Number(e.target.value);
    setAdi(val < -100 ? -100 : val > 100 ? 100 : val);
  };

  const handleSend = () => {
    const data = { altitude: alt, his: his, adi: adi };

    fetch('http://localhost:4000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) alert('הנתונים נשלחו בהצלחה');
        else alert('אירעה שגיאה בשליחה');
      })
      .catch(err => {
        console.error('שגיאה בשליחה:', err);
        alert('שגיאה בשליחה');
      });
  };

  return (
    <div className="instrument-panel" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <div className="form" style={{ marginBottom: '10px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <label>
          Altitude:
          <input type="number" value={alt} onChange={handleAltChange} min="0" max="3000" step="1" style={{ width: '80px', marginLeft: '5px' }} />
        </label>
        <label>
          HIS:
          <input type="number" value={his} onChange={handleHisChange} min="0" max="360" step="1" style={{ width: '60px', marginLeft: '5px' }} />
        </label>
        <label>
          ADI:
          <input type="number" value={adi} onChange={handleAdiChange} min="-100" max="100" step="1" style={{ width: '60px', marginLeft: '5px' }} />
        </label>
        <button onClick={handleSend} style={{ marginLeft: '10px' }}>SEND</button>
      </div>

      {mode === 'text' ? <TextDisplay alt={alt} his={his} adi={adi} /> : <VisualDisplay alt={alt} his={his} adi={adi} />}
    </div>
  );
}

function App() {
  const [displayMode, setDisplayMode] = useState('text');
  const [panelCount, setPanelCount] = useState(1);
  const addPanel = () => setPanelCount(c => c + 1);

  return (
    <div className="App" style={{ direction: 'ltr', fontFamily: 'Arial, sans-serif', padding: '10px' }}>
      <div className="controls" style={{ marginBottom: '15px' }}>
        <button onClick={() => setDisplayMode('text')} disabled={displayMode === 'text'}>TEXT</button>
        <button onClick={() => setDisplayMode('visual')} disabled={displayMode === 'visual'} style={{ marginLeft: '5px' }}>VISUAL</button>
        <button onClick={addPanel} style={{ marginLeft: '15px' }}>+</button>
      </div>

      {Array.from({ length: panelCount }).map((_, i) => (
        <InstrumentPanel key={i} mode={displayMode} />
      ))}
    </div>
  );
}

export default App;
