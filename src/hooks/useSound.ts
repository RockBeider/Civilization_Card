import { useState, useRef, useCallback } from 'react';

export const useSound = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isInit, setIsInit] = useState<boolean>(false);

    const initAudio = () => {
        if (isInit) return;
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        audioCtxRef.current = new AudioContext();
        setIsInit(true);
    };

    const playSound = useCallback((type: string) => {
        if (isMuted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'build') {
            osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
        } else if (type === 'upgrade') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.2);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (type === 'research') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.setValueAtTime(659.25, now + 0.1); osc.frequency.setValueAtTime(783.99, now + 0.2);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0.05, now + 0.2); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (type === 'age') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, now); osc.frequency.linearRampToValueAtTime(880, now + 1.5);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0.1, now + 1.0); gainNode.gain.linearRampToValueAtTime(0.001, now + 2.0);
            osc.start(now); osc.stop(now + 2.0);
        } else if (type === 'wonder') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(261.63, now); osc.frequency.exponentialRampToValueAtTime(523.25, now + 2);
            const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain(); osc2.connect(gain2); gain2.connect(ctx.destination);
            osc2.type = 'triangle'; osc2.frequency.setValueAtTime(329.63, now); osc2.frequency.exponentialRampToValueAtTime(659.25, now + 2);
            gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0, now + 2.5);
            gain2.gain.setValueAtTime(0.1, now); gain2.gain.linearRampToValueAtTime(0, now + 2.5);
            osc.start(now); osc.stop(now + 2.5); osc2.start(now); osc2.stop(now + 2.5);
        } else if (type === 'disaster') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.5);
            gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0.001, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if (type === 'error') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0.001, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        }
    }, [isMuted, isInit]);

    const toggleMute = () => setIsMuted(!isMuted);
    return { initAudio, playSound, isMuted, toggleMute };
};
