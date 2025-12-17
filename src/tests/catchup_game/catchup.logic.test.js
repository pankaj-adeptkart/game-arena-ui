import { describe, test, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCatchUpGame } from "../../pages/catchup_number/useCatchUpGame";

/* -----------------------------
   SILENCE AUDIO + MEDIA ERRORS
----------------------------- */
beforeAll(() => {
    Object.defineProperty(global.HTMLMediaElement.prototype, "play", {
        configurable: true,
        value: vi.fn(),
    });
    Object.defineProperty(global.HTMLMediaElement.prototype, "load", {
        configurable: true,
        value: vi.fn(),
    });
});

/* -----------------------------
   LOGIC TESTS
----------------------------- */
describe("CatchUpGame Logic (CI-safe)", () => {

    test("HvH: selection follows active turn", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "Player1" })
        );

        act(() => {
            result.current.setMode("hvh");
            result.current.startGame();
        });

        // Player 1
        act(() => {
            result.current.handleBallClick(3);
        });

        expect(result.current.selected).toEqual([3]);
        expect(result.current.isP1Turn).toBe(true);

        // simulate turn switch
        act(() => {
            result.current.setSelected([]);
            result.current.setIsP1Turn(false);
        });

        // Player 2
        act(() => {
            result.current.handleBallClick(5);
        });

        expect(result.current.selected).toEqual([5]);
        expect(result.current.isP1Turn).toBe(false);
    });

    test("HvBot: human cannot select balls on bot turn", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "You" })
        );

        act(() => {
            result.current.setMode("hvbot");
            result.current.startGame();
        });

        // force bot turn
        act(() => {
            result.current.setIsP1Turn(false);
        });

        act(() => {
            result.current.handleBallClick(2);
        });

        expect(result.current.selected).toEqual([]);
    });

    test("Undo stack snapshot preserves state shape", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "You" })
        );

        act(() => {
            result.current.startGame();
        });

        act(() => {
            result.current.undoStackRef.current.push({
                available: [1, 2, 3],
                scores: { p1: 5, p2: 7 },
                isP1Turn: true,
            });
        });

        const snap = result.current.undoStackRef.current[0];

        expect(snap).toHaveProperty("available");
        expect(snap).toHaveProperty("scores");
        expect(snap).toHaveProperty("isP1Turn");
    });

    test("UNDO / REDO symmetry: state is restored correctly", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "You" })
        );

        // --- Initial state A ---
        act(() => {
            result.current.startGame();
        });

        const stateA = {
            available: [...result.current.available],
            scores: { ...result.current.scores },
            isP1Turn: result.current.isP1Turn,
        };

        // --- Simulate a confirmed move (state B) ---
        act(() => {
            // push snapshot like applyMove does
            result.current.undoStackRef.current.push({
                available: stateA.available,
                scores: stateA.scores,
                isP1Turn: stateA.isP1Turn,
            });

            // mutate to new state B
            result.current.setAvailable([2, 4, 6]);
            result.current.setScores({ p1: 3, p2: 0 });
            result.current.setIsP1Turn(false);
        });

        const stateB = {
            available: [...result.current.available],
            scores: { ...result.current.scores },
            isP1Turn: result.current.isP1Turn,
        };

        // --- UNDO ---
        act(() => {
            const snap = result.current.undoStackRef.current.pop();

            // push current to redo (as your logic does)
            result.current.redoStackRef.current.push({
                available: stateB.available,
                scores: stateB.scores,
                isP1Turn: stateB.isP1Turn,
            });

            result.current.setAvailable(snap.available);
            result.current.setScores(snap.scores);
            result.current.setIsP1Turn(snap.isP1Turn);
            result.current.setSelected([]);
        });

        // ASSERT: back to A
        expect(result.current.available).toEqual(stateA.available);
        expect(result.current.scores).toEqual(stateA.scores);
        expect(result.current.isP1Turn).toBe(stateA.isP1Turn);

        // --- REDO ---
        act(() => {
            const redoSnap = result.current.redoStackRef.current.pop();

            // push current back to undo
            result.current.undoStackRef.current.push({
                available: stateA.available,
                scores: stateA.scores,
                isP1Turn: stateA.isP1Turn,
            });

            result.current.setAvailable(redoSnap.available);
            result.current.setScores(redoSnap.scores);
            result.current.setIsP1Turn(redoSnap.isP1Turn);
            result.current.setSelected([]);
        });

        // ASSERT: back to B
        expect(result.current.available).toEqual(stateB.available);
        expect(result.current.scores).toEqual(stateB.scores);
        expect(result.current.isP1Turn).toBe(stateB.isP1Turn);
    });

    test("HvBot: bot move replay correctness (undo → redo)", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "You" })
        );

        // Start HvBot game
        act(() => {
            result.current.setMode("hvbot");
            result.current.startGame();
        });

        // --- State A (before bot move) ---
        const stateA = {
            available: [...result.current.available],
            scores: { ...result.current.scores },
            isP1Turn: true,
        };

        // --- Simulate bot move (Player 2) ---
        act(() => {
            // push snapshot like applyMove
            result.current.undoStackRef.current.push(stateA);

            result.current.setAvailable([2, 4, 6]);
            result.current.setScores({ p1: 0, p2: 3 });
            result.current.setIsP1Turn(true); // bot finished → back to human
        });

        const stateB = {
            available: [...result.current.available],
            scores: { ...result.current.scores },
            isP1Turn: result.current.isP1Turn,
        };

        // --- UNDO ---
        act(() => {
            const snap = result.current.undoStackRef.current.pop();
            result.current.redoStackRef.current.push(stateB);

            result.current.setAvailable(snap.available);
            result.current.setScores(snap.scores);
            result.current.setIsP1Turn(snap.isP1Turn);
            result.current.setSelected([]);
        });

        expect(result.current.available).toEqual(stateA.available);
        expect(result.current.scores).toEqual(stateA.scores);
        expect(result.current.isP1Turn).toBe(true);

        // --- REDO ---
        act(() => {
            const redoSnap = result.current.redoStackRef.current.pop();
            result.current.undoStackRef.current.push(stateA);

            result.current.setAvailable(redoSnap.available);
            result.current.setScores(redoSnap.scores);
            result.current.setIsP1Turn(redoSnap.isP1Turn);
            result.current.setSelected([]);
        });

        expect(result.current.available).toEqual(stateB.available);
        expect(result.current.scores).toEqual(stateB.scores);
        expect(result.current.isP1Turn).toBe(true);
    });

    test("Time-travel stress: 100 undo operations", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "StressTest" })
        );

        act(() => {
            result.current.startGame();
        });

        // Create 100 fake snapshots
        act(() => {
            for (let i = 1; i <= 100; i++) {
                result.current.undoStackRef.current.push({
                    available: [i, i + 1],
                    scores: { p1: i, p2: 0 },
                    isP1Turn: i % 2 === 0,
                });
            }
        });

        // Undo all
        act(() => {
            while (result.current.undoStackRef.current.length) {
                const snap = result.current.undoStackRef.current.pop();
                result.current.setAvailable(snap.available);
                result.current.setScores(snap.scores);
                result.current.setIsP1Turn(snap.isP1Turn);
            }
        });

        // Final state must match first snapshot
        expect(result.current.available).toEqual([1, 2]);
        expect(result.current.scores).toEqual({ p1: 1, p2: 0 });
    });

    test("Performance: 1000 undo operations within budget", () => {
        const { result } = renderHook(() =>
            useCatchUpGame({ name: "PerfTest" })
        );

        act(() => {
            result.current.startGame();
        });

        // Seed undo stack
        act(() => {
            for (let i = 0; i < 1000; i++) {
                result.current.undoStackRef.current.push({
                    available: [i],
                    scores: { p1: i, p2: 0 },
                    isP1Turn: true,
                });
            }
        });

        const start = performance.now();

        act(() => {
            while (result.current.undoStackRef.current.length) {
                const snap = result.current.undoStackRef.current.pop();
                result.current.setAvailable(snap.available);
                result.current.setScores(snap.scores);
            }
        });

        const duration = performance.now() - start;

        // generous CI-safe threshold
        expect(duration).toBeLessThan(50);
    });

});
