import { useState, useEffect } from 'react';

const WatchClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    // Calculate angles
    const secondDegree = ((seconds / 60) * 360) + 90;
    const minuteDegree = ((minutes / 60) * 360) + 90;
    const hourDegree = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

    return (
        <div style={{
            width: '300px',
            height: '300px',
            position: 'relative',
            border: '8px solid var(--color-primary)',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.8)',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.3), inset 0 0 30px rgba(57, 255, 20, 0.1)',
            backdropFilter: 'blur(5px)'
        }}>
            {/* Clock Face Markers */}
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: '4px',
                    height: '15px',
                    background: 'var(--color-primary)',
                    left: '50%',
                    top: '10px',
                    transformOrigin: '50% 140px', // Center of clock (150px) - top offset (10px) = 140px pivot
                    transform: `translateX(-50%) rotate(${i * 30}deg)`
                }}></div>
            ))}

            {/* Hands Wrapper */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%'
            }}>
                {/* Hour Hand */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '50%',
                    height: '6px',
                    background: 'var(--color-white)',
                    transformOrigin: '0% 50%', // Rotate from left center
                    transform: `rotate(${hourDegree - 90}deg)`, // Adjust for 0deg being 3 o'clock default
                    borderRadius: '4px'
                }}></div>

                {/* Minute Hand */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '40%', // Shorter representation, wait standard CSS rotate is usually from 0=top?
                    // Let's standardise: 0deg is 90deg effectively in CSS unless modified. 
                    // Let's stick to standard transformOrigin 
                }}></div>

                {/* Re-doing hands with simpler absolute positioning relative to center */}

                {/* Hour Hand */}
                <div style={{
                    width: '6px',
                    height: '70px',
                    background: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'bottom center',
                    transform: `translate(-50%, -100%) rotate(${hours * 30 + minutes / 2}deg)`,
                    borderRadius: '4px',
                    zIndex: 2
                }}></div>

                {/* Minute Hand */}
                <div style={{
                    width: '4px',
                    height: '100px',
                    background: 'var(--color-primary)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'bottom center',
                    transform: `translate(-50%, -100%) rotate(${minutes * 6 + seconds / 10}deg)`,
                    borderRadius: '4px',
                    zIndex: 3,
                    boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
                }}></div>

                {/* Second Hand */}
                <div style={{
                    width: '2px',
                    height: '120px',
                    background: '#ff3939', /* Red for contrast or keep neon? User said black and neon green. Let's make it White or a different Neon */
                    background: '#ffffff',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'bottom center',
                    transform: `translate(-50%, -100%) rotate(${seconds * 6}deg)`,
                    zIndex: 4
                }}></div>

                {/* Center Dot */}
                <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'var(--color-primary)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: 5,
                    boxShadow: '0 0 10px var(--color-primary)'
                }}></div>
            </div>

            {/* Digital Time Display */}
            <div style={{
                position: 'absolute',
                bottom: '60px',
                width: '100%',
                textAlign: 'center',
                color: 'var(--color-primary)',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}>
                {time.toLocaleTimeString()}
            </div>
        </div>
    );
};

export default WatchClock;
