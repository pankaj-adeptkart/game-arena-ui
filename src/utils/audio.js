// src/utils/audio.js
export const sfx = {
    click: new Audio('/sfx/click.mp3'), // create or add files to public/sfx
    win: new Audio('/sfx/win.mp3'),
    lose: new Audio('/sfx/lose.mp3'),
    pop: new Audio('/sfx/pop.mp3'),
};

export function play(name) {
    try {
        const a = sfx[name];
        if (!a) return;
        a.currentTime = 0;
        a.play();
    } catch (e) {
        // muted or not loaded
    }
}

export function vibrate(ms = 40) {
    if (navigator.vibrate) navigator.vibrate(ms);
}
