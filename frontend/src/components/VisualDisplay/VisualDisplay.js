import React, { useEffect, useRef } from 'react';
import './VisualDisplay.css';

function VisualDisplay({ alt, his, adi }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textBaseline = 'middle';

        /*** Altitude Gauge ***/
        const altMin = 0, altMax = 3000;
        const gaugeX = 20, barWidth = 10;
        const topMargin = 20, bottomMargin = 20;
        const gaugeBottomY = height - bottomMargin;
        const gaugeHeight = gaugeBottomY - topMargin;
        const altScale = gaugeHeight / (altMax - altMin);

        // Draw altitude scale
        for (let value = altMin; value <= altMax; value += 1000) {
            const y = gaugeBottomY - (value - altMin) * altScale;
            ctx.beginPath();
            ctx.moveTo(gaugeX + barWidth, y);
            ctx.lineTo(gaugeX + barWidth + 5, y);
            ctx.stroke();
            ctx.fillText(value, gaugeX + barWidth + 7, y);
        }

        // Draw altitude bar
        const altValueY = gaugeBottomY - (Math.max(altMin, Math.min(altMax, alt)) - altMin) * altScale;
        ctx.fillStyle = 'blue';
        ctx.fillRect(gaugeX, altValueY, barWidth, gaugeBottomY - altValueY);

        /*** Compass ***/
        const compassX = 80, compassRadius = 50;
        const centerX = compassX + compassRadius, centerY = height / 2;

        // Draw compass circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, compassRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw compass markings (N, E, S, W)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-his * Math.PI / 180);
        ctx.fillText('N', -5, -compassRadius + 15);
        ctx.fillText('E', compassRadius - 15, -5);
        ctx.fillText('S', -3, compassRadius - 15);
        ctx.fillText('W', -compassRadius + 10, -5);
        ctx.restore();

        // Draw compass arrow
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - (compassRadius - 5));
        ctx.lineTo(centerX - 5, centerY - (compassRadius - 15));
        ctx.lineTo(centerX + 5, centerY - (compassRadius - 15));
        ctx.closePath();
        ctx.fill();

        /*** ADI Indicator ***/
        const adiX = 200, adiRadius = 40;
        const adiCenterX = adiX + adiRadius, adiCenterY = height / 2;
        const adiColor = adi > 0 ? 'green' : adi < 0 ? 'red' : 'blue';

        // Draw ADI circle
        ctx.beginPath();
        ctx.arc(adiCenterX, adiCenterY, adiRadius, 0, 2 * Math.PI);
        ctx.fillStyle = adiColor;
        ctx.fill();
        ctx.stroke();
    }, [alt, his, adi]);

    return <canvas ref={canvasRef} width="300" height="300" className="visual-display-canvas" />;
}

export default VisualDisplay;
