import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LatLng, RunPhase } from '../types/route';

import { createMMKV } from 'react-native-mmkv'

const storage = createMMKV()

export const useRunStore = create(
    persist((set: any) => ({
        location: null as LatLng | null,
        phase: 'idle' as RunPhase,
        sequenceIndex: 0,
        lastHitId: null as string | null,
        inEndZone: false,
        elapsedSec: 0 as number,
        panelOpen: true,

        setLocation: (location: LatLng | null) => set({ location }),
        setPhase: (phase: RunPhase) => set({ phase }),
        setSequenceIndex: (sequenceIndex: number) => set({ sequenceIndex }),
        setLastHitId: (lastHitId: string | null) => set({ lastHitId }),
        setInEndZone: (inEndZone: boolean) => set({ inEndZone }),
        setElapsedSec: (value: number | ((prev: number) => number)) =>
            set((state: any) => ({
                elapsedSec:
                    typeof value === 'function' ? value(state.elapsedSec) : value,
            })),
        setPanelOpen: (panelOpen: boolean) => set({ panelOpen }),
    }), {
        name: 'run-store',
        storage: createJSONStorage(() => ({
            getItem: async (name: string) => {
                const value = storage.getString(name);
                return value ?? null;
            },
            setItem: async (name: string, value: string) => {
                storage.set(name, value);
            },
            removeItem: async (name: string) => {
                storage.delete(name);
            },
        })),
    },
    ),
);
