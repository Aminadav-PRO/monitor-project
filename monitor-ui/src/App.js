import React, { useState, useEffect, useRef } from 'react';

function App() {
    // state
    const [altitude, setAltitude] = useState('');
    const [his, setHis] = useState('');
    const [adi, setAdi] = useState('');

    const canvasRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            altitude: Number(altitude),
            his: Number(his),
            adi: Number(adi),
        };

        fetch('http://localhost:4000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(text => {
                console.log('Server returned:', text);
            })
            .catch(error => {
                console.error('Error sending to server:', error);
            });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // ניקוי הקנבס
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ציור Altitude
        const maxAltitude = 3000;
        const barHeight = (Number(altitude) / maxAltitude) * canvas.height;
        ctx.fillStyle = 'blue';
        ctx.fillRect(50, canvas.height - barHeight, 30, barHeight);
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Altitude: ${altitude}`, 50, canvas.height - barHeight - 10);

        // ציור HIS
        const centerX = 150, centerY = 150, radius = 40;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        const angle = (Number(his) - 90) * Math.PI / 180;
        const arrowX = centerX + radius * Math.cos(angle);
        const arrowY = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(arrowX, arrowY);
        ctx.stroke();
        ctx.fillText(`HIS: ${his}`, centerX - 20, centerY + radius + 20);

        // ציור ADI
        const adiX = 250, adiY = 150, adiRadius = 30;
        let adiColor = 'gray';
        if (Number(adi) > 0) adiColor = 'green';
        else if (Number(adi) < 0) adiColor = 'red';

        ctx.beginPath();
        ctx.arc(adiX, adiY, adiRadius, 0, 2 * Math.PI);
        ctx.fillStyle = adiColor;
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.fillText(`ADI: ${adi}`, adiX - 20, adiY + adiRadius + 20);

    }, [altitude, his, adi]);

    return (
        <div style={{ direction: 'rtl', padding: '20px' }}>
            <h1>Submit flight data</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Altitude:
                    <input
                        type="number"
                        name="altitude"
                        value={altitude}
                        onChange={(e) => setAltitude(e.target.value)}
                        min="0"
                        max="3000"
                    />
                </label>
                <br /><br />
                <label>
                    HIS:
                    <input
                        type="number"
                        name="his"
                        value={his}
                        onChange={(e) => setHis(e.target.value)}
                        min="0"
                        max="360"
                    />
                </label>
                <br /><br />
                <label>
                    ADI:
                    <input
                        type="number"
                        name="adi"
                        value={adi}
                        onChange={(e) => setAdi(e.target.value)}
                        min="-100"
                        max="100"
                    />
                </label>
                <br /><br />
                <button type="submit">send</button>
            </form>

            <canvas
                ref={canvasRef}
                width="400"
                height="300"
                style={{ border: '1px solid black' }}
            />
        </div>
    );
}

export default App;
