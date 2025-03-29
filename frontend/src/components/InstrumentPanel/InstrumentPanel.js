import React, { useState } from 'react';
import TextDisplay from '../TextDisplay/TextDisplay';
import VisualDisplay from '../VisualDisplay/VisualDisplay';
import { SERVER_URL, ALTITUDE_MIN, ALTITUDE_MAX, HIS_MIN, HIS_MAX, ADI_MIN, ADI_MAX } from '../../config'; // Import config
import './InstrumentPanel.css';

function InstrumentPanel({ mode }) {
    const [alt, setAlt] = useState(0);
    const [his, setHis] = useState(0);
    const [adi, setAdi] = useState(0);

    const handleSend = () => {
        const data = { altitude: alt, his: his, adi: adi };

        fetch(`${SERVER_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
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
        <div className="instrument-panel">
            <div className="input-container">
                <label>Altitude: <input type="number" value={alt} onChange={(e) => setAlt(Math.max(ALTITUDE_MIN, Math.min(ALTITUDE_MAX, Number(e.target.value))))} /></label>
                <label>HIS: <input type="number" value={his} onChange={(e) => setHis(Math.max(HIS_MIN, Math.min(HIS_MAX, Number(e.target.value))))} /></label>
                <label>ADI: <input type="number" value={adi} onChange={(e) => setAdi(Math.max(ADI_MIN, Math.min(ADI_MAX, Number(e.target.value))))} /></label>
                <button className="send-button" onClick={handleSend}>SEND</button>
            </div>
            {mode === 'text' ? <TextDisplay alt={alt} his={his} adi={adi} /> : <VisualDisplay alt={alt} his={his} adi={adi} />}
        </div>
    );
}

export default InstrumentPanel;
