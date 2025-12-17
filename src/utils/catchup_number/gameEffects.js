import confetti from "canvas-confetti";
import { sfx } from "../../config/audio";

export const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
};

export const fireFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999
    };

    const interval = setInterval(() => {
        const timeLeft = end - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 250);
};

export const updateBgMusicSpeed = (availableCount, total) => {
    const progress = 1 - availableCount / total;
    sfx.bg.rate(1 + progress * 0.5);
};
