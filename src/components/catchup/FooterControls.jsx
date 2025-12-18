import TurboButton from "./buttons/TurboButton";
import ResetButton from "./buttons/ResetButton";
import ExitButton from "./buttons/ExitButton";

export default function DesktopFooterControls({
    turbo,
    setTurbo,
    resetGameSession,
    setShowSettings,
    setStatus,
    sfx,
}) {
    return (
        <footer className="hidden lg:flex sticky top-0 bottom-0 left-0 w-full justify-center gap-6 p-4 pointer-events-none z-40">
            <div className="flex gap-4 pointer-events-auto ">
                <ResetButton
                    resetGameSession={resetGameSession}
                    setShowSettings={setShowSettings}
                    setStatus={setStatus}
                    sfx={sfx}
                />

                <TurboButton
                    turbo={turbo}
                    setTurbo={setTurbo}
                    size="md"
                />

                <ExitButton
                    resetGameSession={resetGameSession}
                    setShowSettings={setShowSettings}
                    setStatus={setStatus}
                    sfx={sfx}
                />
            </div>
        </footer >
    );
}
