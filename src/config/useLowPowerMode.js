import { useState, useEffect } from 'react';

export function useLowPowerMode() {
    const [isLowPower, setIsLowPower] = useState(false);

    useEffect(() => {
        const checkPerformance = () => {
            // 1. Check for "Save Data" / "Lite Mode" headers
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection && (connection.saveData === true || connection.effectiveType === '2g')) {
                return true;
            }

            // 2. Hardware Concurrency (CPU Cores)
            // iPhone 12 has 6 cores. Low-end Androids usually have 4.
            // We set the threshold to <= 4 to allow iPhones (6+) to be "High Power".
            const cores = navigator.hardwareConcurrency || 4;

            // 3. iOS Detection (Assume High Power for modern iOS unless explicitly low core)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (isIOS) {
                // If it's an iPhone with at least 6 cores, it's definitely High Power.
                // Even older iPhones are usually capable of WebGL.
                if (cores >= 4) return false;
            }

            // For Android/Desktop: If less than 4 cores, assume low power.
            if (cores < 4) return true;

            // 4. Memory (RAM) - Android Only API
            // If device has less than 4GB RAM, treat as low power
            if (navigator.deviceMemory && navigator.deviceMemory < 4) {
                return true;
            }

            return false;
        };

        setIsLowPower(checkPerformance());
    }, []);

    return isLowPower;
}