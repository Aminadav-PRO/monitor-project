import React, { useState } from 'react';
import InstrumentPanel from './components/InstrumentPanel/InstrumentPanel';

function App() {
  const [displayMode, setDisplayMode] = useState('text');
const [panelCount, setPanelCount] = useState(1);
const addPanel = () => setPanelCount(c => c + 1);

  return (
      <div style={{ padding: '10px' }}>
        <div>
          <button onClick={() => setDisplayMode('text')} disabled={displayMode === 'text'}>TEXT</button>
          <button onClick={() => setDisplayMode('visual')} disabled={displayMode === 'visual'} style={{ marginLeft: '5px' }}>VISUAL</button>
            <button onClick={addPanel} style={{ marginLeft: '15px' }}>+</button>

            {Array.from({ length: panelCount }).map((_, i) => (
                <InstrumentPanel key={i} mode={displayMode} />
            ))}
        </div>
      </div>
  );
}

export default App;
