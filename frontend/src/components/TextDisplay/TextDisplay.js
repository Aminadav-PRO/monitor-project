import React from 'react';
import './TextDisplay.css';

function TextDisplay({ alt, his, adi }) {
    return (
        <div className="text-display">
            <div className="circle altitude-circle">
                <div className="circle-label">Altitude</div>
                <div className="circle-value">{alt}</div>
            </div>
            <div className="circle his-circle">
                <div className="circle-label">HIS</div>
                <div className="circle-value">{his}</div>
            </div>
            <div className="circle adi-circle">
                <div className="circle-label">ADI</div>
                <div className="circle-value">{adi}</div>
            </div>
        </div>
    );
}

export default TextDisplay;
