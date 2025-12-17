export const sumArray = (arr) =>
    arr.reduce((a, b) => a + b, 0);

export const getWinner = (scores, names) => {
    if (scores.p1 > scores.p2) return names.p1;
    if (scores.p2 > scores.p1) return names.p2;
    return "DRAW";
};

export const createBallSet = (count) =>
    Array.from({ length: count }, (_, i) => i + 1);
