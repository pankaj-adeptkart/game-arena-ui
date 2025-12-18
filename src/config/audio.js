import { Howl } from 'howler';

export const sfx = {
    // Common Sounds
    pop: new Howl({ src: ['sounds/pop/bubble-pop.mp3'], volume: 0.5 }),
    win: new Howl({ src: ['sounds/win/brass-fanfare-with-timpani-and-winchimes-reverberated.mp3'], volume: 0.6 }),
    switch: new Howl({ src: ['sounds/pop/bubble-pop.mp3'], volume: 0.5 }),

    // Game Specific Sounds
    bg: new Howl({
        src: ['sounds/background/music-for-game-fun-kid-game.mp3'],
        volume: 0.3,
        loop: true,
        html5: true // <--- IMPORTANT: Add this for large music files to help them stream on servers
    }),
    glitch: new Howl({ src: ['sounds/pop/bubble-pop.mp3'], volume: 0.5, rate: 2.0 }),

    // Helper to stop all music
    stopAll: () => {
        Howler.stop();
    }
};