import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import Config from 'react-native-config';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RoutePoint } from '../../types/route';
import ProgressStep from './components/progress-step.component';
import centroid from '../../utils/centroid';
import { ROUTE_POINTS } from '../../data/exampleRoute';
import isInsidePolygon from '../../utils/isInsidePolygon';
import buildSequence from '../../utils/buildSequence';
import { styles, darkMapStyle, markerStyles } from './styles';
import { useRunStore } from '../../zustandStore/run-store';

const RunScreen: React.FC = () => {
  const {
    location, setLocation,
    phase, setPhase,
    sequenceIndex, setSequenceIndex,
    lastHitId, setLastHitId,
    inEndZone, setInEndZone,
    elapsedSec, setElapsedSec,
    panelOpen, setPanelOpen
  } = useRunStore()
console.log('location', location)
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mapRef = useRef<MapView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;

  const sequence = useMemo(() => buildSequence(ROUTE_POINTS as RoutePoint[]), []);

  const currentTargetId = sequence[sequenceIndex] ?? null;
  const isAllCpsDone = sequenceIndex >= sequence.length - 1;
  const isRunCompleted = phase === 'completed';

  const currentTarget = useMemo(
    () => ROUTE_POINTS.find(p => p.id === currentTargetId) as RoutePoint | undefined,
    [currentTargetId],
  );

  const cpHitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sequence.forEach(id => {
      if (id !== 'SP' && id !== 'EP') counts[id] = (counts[id] ?? 0) + 1;
    });
    return counts;
  }, [sequence]);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'The app needs your location to track the route.',
          buttonPositive: 'Allow',
        },
      );
      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert('Permission Required', 'Enable location from device Settings.');
        return false;
      }
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      const ok = await requestPermission();
      if (!ok || !mounted) return;

      watchIdRef.current = Geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log(latitude, longitude)
          if (mounted) setLocation({ latitude, longitude });
        },
        err => Alert.alert('Location Error', err.message),
        { enableHighAccuracy: false, distanceFilter: 3, interval: 2000, fastestInterval: 1500 },
      );
    };

    start();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();

    return () => {
      mounted = false;
      if (watchIdRef.current !== null) Geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);


  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => setElapsedSec(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!location) return;

    if (phase === 'running' && isAllCpsDone) {
      const ep = ROUTE_POINTS.find(p => p.id === 'EP') as RoutePoint | undefined;
      setInEndZone(ep ? isInsidePolygon(location, ep.polygon) : false);
      return;
    }

    if (phase !== 'running' || !currentTarget) return;
    if (currentTarget.type === 'END') return;

    const inside = isInsidePolygon(location, currentTarget.polygon);
    if (!inside) return;

    if (lastHitId === currentTargetId) return;

    setLastHitId(currentTargetId);
    setSequenceIndex(prev => prev + 1);

  }, [location]);


  const handleStart = useCallback(() => {
    const sp = ROUTE_POINTS.find(p => p.id === 'SP') as RoutePoint | undefined;
    if (!sp) { Alert.alert('Configuration Error', 'Start point missing.'); return; }

    if (!isInsidePolygon(location, sp.polygon)) {
      Alert.alert('Not in Start Zone', 'Please ride to the Start Zone polygon before tapping Start.');
      return;
    }

    setPhase('running');
    setSequenceIndex(1);
    setLastHitId('SP');
  }, [location]);

  const handleEndRun = useCallback(() => {
    setPhase('completed');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        ...location, latitudeDelta: 0.008, longitudeDelta: 0.008,
      }, 600);
    }
  }, [currentTargetId]);

  const sp = ROUTE_POINTS.find(p => p.id === 'SP') as RoutePoint | undefined;
  const ep = ROUTE_POINTS.find(p => p.id === 'EP') as RoutePoint | undefined;
  const inSpZone = isInsidePolygon(location, sp?.polygon);

  const pointColor = (pointId: string) => {
    if (phase === 'idle') return pointId === 'SP' ? '#22C55E' : '#6B7280';
    if (pointId === currentTargetId) return '#F59E0B';
    const idx = sequence.indexOf(pointId);
    const done = idx < sequenceIndex;
    return done ? '#22C55E' : '#6B7280';
  };

  const remainingPolyline = useMemo(() => {
    if (phase !== 'running') return [];
    return sequence.slice(sequenceIndex).map(id => {
      const pt = ROUTE_POINTS.find(p => p.id === id) as RoutePoint;
      return centroid(pt?.polygon ?? []);
    }).filter(Boolean);
  }, [sequence, sequenceIndex, phase]);

  const completedPolyline = useMemo(() => {
    if (phase !== 'running' || sequenceIndex === 0) return [];
    return sequence.slice(0, sequenceIndex + 1).map(id => {
      const pt = ROUTE_POINTS.find(p => p.id === id) as RoutePoint;
      return centroid(pt?.polygon ?? []);
    }).filter(Boolean);
  }, [sequence, sequenceIndex, phase]);

  const progressSteps = useMemo(() => {
    return sequence.map((id, idx) => {
      const rp = ROUTE_POINTS.find(p => p.id === id) as RoutePoint;
      const type = rp?.type === 'START' ? 'start' : rp?.type === 'END' ? 'end' : 'cp';
      const status = idx < sequenceIndex ? 'done' : idx === sequenceIndex ? 'current' : 'upcoming';

      const prevHits = sequence.slice(0, idx).filter(s => s === id).length;

      return {
        key: `${id}-${idx}`,
        id, label: id, type, status,
        hitIndex: prevHits,
        totalHits: cpHitCounts[id] ?? 1,
        isLast: idx === sequence.length - 1,
      };
    });
  }, [sequence, sequenceIndex]);

  if (isRunCompleted) {
    return (
      <View style={styles.finishBg}>
        <View style={styles.finishCard}>
          <Text style={styles.finishEmoji}>🏁</Text>
          <Text style={styles.finishTitle}>Run Complete!</Text>
          <Text style={styles.finishSub}>Excellent ride, cyclist</Text>
          <View style={styles.finishStat}>
            <Text style={styles.finishStatLabel}>TIME</Text>
            <Text style={styles.finishStatValue}>{formatTime(elapsedSec)}</Text>
          </View>
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => {
              setPhase('idle');
              setSequenceIndex(0);
              setLastHitId(null);
              setElapsedSec(0);
              setInEndZone(false);
            }}
          >
            <Text style={styles.finishBtnText}>New Run</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        followsUserLocation={phase === 'running'}
        showsMyLocationButton={false}
        showsTraffic={false}
        customMapStyle={darkMapStyle}
        region={{
          latitude: location?.latitude ?? 33.738045,
          longitude: location?.longitude ?? 73.084488,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
      >
        {location && (
          <Marker
            coordinate={location}
            title="You"
            pinColor="blue"
          />
        )}

        {completedPolyline.length > 1 && (
          <Polyline coordinates={completedPolyline} strokeWidth={3} strokeColor="#22C55E" lineDashPattern={[4, 4]} />
        )}

        {remainingPolyline.length > 1 && (
          <Polyline coordinates={remainingPolyline} strokeWidth={3} strokeColor="#F59E0B60" />
        )}

        {(ROUTE_POINTS as RoutePoint[]).map(rp => {
          const color = pointColor(rp.id);
          const isCurrent = rp.id === currentTargetId;
          return (
            <React.Fragment key={rp.id}>
              <Polygon
                coordinates={rp.polygon}
                strokeColor={color}
                strokeWidth={isCurrent ? 3 : 1.5}
                fillColor={isCurrent ? `${color}40` : `${color}18`}
              />
              <Marker
                coordinate={centroid(rp.polygon)}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={isCurrent}
              >
                <View style={[markerStyles.pin, { borderColor: color, backgroundColor: isCurrent ? color : '#111827' }]}>
                  <Text style={[markerStyles.pinText, { color: isCurrent ? '#000' : color }]}>
                    {rp.type === 'START' ? 'S' : rp.type === 'END' ? 'E' : rp.id.replace('CP', '')}
                  </Text>
                </View>
              </Marker>
            </React.Fragment>
          );
        })}

        {phase === 'running' && location && currentTarget && !isAllCpsDone && (
          <MapViewDirections
            origin={location}
            destination={centroid(currentTarget.polygon)}
            apikey={Config.GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#F59E0B"
            mode="BICYCLING"
            onError={err => console.warn('Directions:', err)}
          />
        )}
        {phase === 'running' && location && isAllCpsDone && ep && (
          <MapViewDirections
            origin={location}
            destination={centroid(ep.polygon)}
            apikey={Config.GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#A78BFA"
            mode="BICYCLING"
            onError={err => console.warn('Directions:', err)}
          />
        )}
      </MapView>

      <Animated.View style={[styles.topHud, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudTitle}>VELOCYCLE</Text>
          {phase === 'running' && <Text style={styles.hudTimer}>{formatTime(elapsedSec)}</Text>}
        </View>
        {phase === 'running' && (
          <View style={styles.hudRight}>
            <Text style={styles.hudProgress}>{Math.min(sequenceIndex, sequence.length - 1)}/{sequence.length - 1}</Text>
            <Text style={styles.hudProgressLabel}>stops</Text>
          </View>
        )}
      </Animated.View>

      {phase === 'running' && !isAllCpsDone && currentTarget && (
        <View style={styles.targetBanner}>
          <View style={styles.targetDot} />
          <Text style={styles.targetLabel}>NEXT  </Text>
          <Text style={styles.targetId}>{currentTargetId}</Text>
        </View>
      )}

      {phase === 'running' && isAllCpsDone && !isRunCompleted && (
        <View style={[styles.targetBanner, styles.targetBannerPurple]}>
          <Text style={styles.targetLabel}>🏁  HEAD TO END POINT</Text>
        </View>
      )}

      <View style={styles.bottomPanel}>

        <TouchableOpacity style={styles.panelHandle} onPress={() => setPanelOpen(o => !o)}>
          <View style={styles.handleBar} />
        </TouchableOpacity>

        {phase === 'idle' && (
          <View style={styles.panelContent}>
            <Text style={styles.panelTitle}>Ready to Ride?</Text>
            <Text style={styles.panelSub}>
              {inSpZone
                ? '✓ You are in the Start Zone'
                : 'Navigate to the Start Zone (green polygon) to begin.'}
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, !inSpZone && styles.primaryBtnDisabled]}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {inSpZone ? '▶  Start Run' : '⊘  Not in Start Zone'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'running' && panelOpen && (
          <View style={styles.panelContent}>
            <Text style={styles.panelTitle}>Route Progress</Text>
            <ScrollView style={styles.progressScroll} showsVerticalScrollIndicator={false}>
              {progressSteps.map(s => (
                <ProgressStep {...s} key={s.key} />
              ))}
            </ScrollView>

            {isAllCpsDone && inEndZone && (
              <TouchableOpacity style={styles.endBtn} onPress={handleEndRun} activeOpacity={0.85}>
                <Text style={styles.endBtnText}>🏁  End Run</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {phase === 'running' && !panelOpen && (
          <View style={styles.panelCollapsed}>
            <Text style={styles.collapsedText}>
              {isAllCpsDone ? '🏁 Head to End Point' : `Next: ${currentTargetId}`}
            </Text>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

export default RunScreen;