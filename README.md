# Cyclist Tracking — Technical Test

A React Native app that tracks a cyclist through a geofenced route: a guarded start point, ordered checkpoints, and a guarded end point.

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- React Native CLI environment fully configured — follow the [official environment setup guide](https://reactnative.dev/docs/set-up-your-environment) for your platform
- A `.env` file at the project root containing your Google Maps API key:
  ```
  GOOGLE_MAPS_APIKEY=your_key_here
  ```
- For iOS: Ruby, Bundler, and CocoaPods
- For Android: Android Studio with a configured emulator or physical device

### Install dependencies

```sh
npm install
```

For iOS, also install native dependencies:

```sh
bundle install
bundle exec pod install --project-directory=ios
```

### Run the app

Start the Metro bundler:

```sh
npm start
```

Then, in a separate terminal:

```sh
# Android
npm run android

# iOS
npm run ios
```

The main screen implementation is in `src/screens/RunScreen.tsx`. Location permissions are declared in `android/app/src/main/AndroidManifest.xml` and `ios/TestWyxan/Info.plist`.

---

## Approach & Architecture

### State management

Global run state is managed with **Zustand** (`src/zustandStore/run-store.ts`). The store holds: `phase` (`idle | running | completed`), `sequenceIndex` (which stop is currently active), `lastHitId` (the most recently completed checkpoint, used to enforce the no-consecutive-hits rule), `inEndZone`, `elapsedSec`, and `panelOpen`. Zustand was chosen over a local `useReducer` to keep `RunScreen` lean and allow the `ProgressStep` sub-component to subscribe to relevant slices without prop-drilling.

### Checkpoint sequencing

Route points are defined in `src/data/exampleRoute.ts` as an array of `RoutePoint` objects, each carrying an `id`, `type` (`START | CP | END`), `polygon`, and optional `hits` count. On mount, `buildSequence` pre-processes this array into a flat visit queue — for example, `[{ id: "CP1", hits: 2 }, { id: "CP2", hits: 2 }]` expands to `["SP", "CP1", "CP2", "CP1", "CP2", "EP"]`. The active checkpoint is always `sequence[sequenceIndex]`, so progression at runtime is a single index increment with no special-case branching.

### Location stream

`@react-native-community/geolocation` is used with `watchPosition` configured at `distanceFilter: 3` metres and a 2-second interval. Each position update triggers a `useEffect` that runs the geofence checks in order:

1. If all CPs are done, check whether the user is inside the End Point polygon and update `inEndZone`.
2. Otherwise, run `isInsidePolygon` against the active checkpoint's polygon.
3. If inside, and `lastHitId !== currentTargetId` (no consecutive re-hit), advance `sequenceIndex` and record `lastHitId`.

The watcher is started after Android runtime permission is granted and is cleaned up on unmount.

### Polygon intersection

`src/utils/isInsidePolygon.ts` implements the **ray-casting algorithm** on the GeoJSON coordinate arrays. No external geometry library is used — the function casts a horizontal ray from the test point and counts boundary crossings; an odd count means the point is inside. It handles `null` location and missing polygon gracefully, returning `false`.

### Map rendering

`react-native-maps` with `PROVIDER_GOOGLE` renders:
- All route polygons, colour-coded: green for completed, amber for the active target, grey for upcoming.
- A dashed green polyline over completed legs and a faded amber polyline over remaining legs, built from polygon centroids (`src/utils/centroid.ts`).
- A live `MapViewDirections` cycling route from the user's position to the current target (amber) or to the End Point once all CPs are done (purple).
- The map follows the user during a run (`followsUserLocation`) and re-centres on the new target whenever `currentTargetId` changes.

### UI

The screen is split into a full-screen map and a slide-up bottom panel. The panel shows a start prompt (with a live in-zone check) in the `idle` phase, and a scrollable `ProgressStep` list plus an End Run button during the `running` phase. A top HUD shows the app name, an elapsed timer, and a stop counter. Entry animations use `Animated.parallel` (fade + spring slide).

---

## Edge Cases & Limitations

**GPS noise near polygon boundaries.** A jittery fix sitting on the edge of a polygon can fire rapid enter/exit callbacks. The `lastHitId` guard prevents an immediate re-hit of the same checkpoint, but if two callbacks arrive in the same JS event-loop turn before state updates flush, a double-advance is theoretically possible on slow devices.

**Rapid polygon transit.** With `distanceFilter: 3` and a 2-second interval, a cyclist moving at speed through a narrow polygon may never receive a fix inside it. The checkpoint would be silently skipped. Reducing the interval or distanceFilter improves catch-rate at the cost of battery life.

**`enableHighAccuracy: false`.** The watcher is configured with high accuracy disabled to reduce battery drain. On devices where network-based location is coarse (>10 m error), polygon entry detection near boundaries will be unreliable. Switching to `enableHighAccuracy: true` is advisable for real-world use.

**Google Maps API key required.** `MapViewDirections` will silently fail (a `console.warn` is emitted) if `GOOGLE_MAPS_APIKEY` is missing or invalid. The rest of the map still renders correctly, but turn-by-turn routing arrows will be absent.

**Single-screen state reset.** Tapping "New Run" resets Zustand state but does not restart the location watcher (it stays running from mount). If the watcher has errored out during a run, a fresh watcher is not started on reset without a full remount of the screen.

**No background location.** The app only tracks location while foregrounded. Backgrounding the app during a run will pause GPS updates and may cause missed checkpoint hits.