import { StyleSheet, Platform } from 'react-native';

import Colors from '../../core/constants/styles/color';

export const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor:  Colors.background.primary 
  },
  topHud: {
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 56 : 16,
    left: 16, right: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
  },
  hudLeft: {},
  hudTitle: {
    color:  Colors.text.primary, fontSize: 14, fontWeight: "bold", letterSpacing: 4,
  },
  hudTimer: {
    color: Colors.accent.amber, fontSize: 28, fontWeight: '700', letterSpacing: 2, marginTop: 2,
  },
  hudRight: {
    backgroundColor: Colors.background.secondary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
    alignItems: 'center',
  },
  hudProgress: { color: Colors.text.primary, fontSize: 18, fontWeight: '700' },
  hudProgressLabel: { color: Colors.text.tertiary, fontSize: 10, letterSpacing: 1 },
  targetBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 80,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor:  Colors.background.overlay,
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1, borderColor: Colors.accent.amberSoft,
  },
  targetBannerPurple: {
    borderColor: Colors.accent.purpleSoft,
  },
  targetDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent.amber, marginRight: 8,
  },
  targetLabel: { color: Colors.text.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  targetId: { color: Colors.accent.amber, fontSize: 14, fontWeight: '800' },

  bottomPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 0.5, borderColor: Colors.background.secondary,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    minHeight: 100,
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  panelHandle: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handleBar: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.background.secondary,
  },
  panelContent: { paddingHorizontal: 20, paddingTop: 8 },
  panelCollapsed: { paddingHorizontal: 20, paddingBottom: 8 },
  collapsedText: { color: Colors.text.tertiary, fontSize: 14, textAlign: 'center' },
  panelTitle: { color: Colors.text.primary, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  panelSub: { color: Colors.text.tertiary, fontSize: 13, marginBottom: 14 },

  progressScroll: { maxHeight: 220 },

  primaryBtn: {
    backgroundColor: Colors.accent.green, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  primaryBtnDisabled: { backgroundColor: Colors.ui.disabled},
  primaryBtnText: { color: Colors.common.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },

  endBtn: {
    backgroundColor: Colors.accent.purple, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  endBtnText: { color: Colors.common.white, fontSize: 15, fontWeight: '700' },
  finishBg: {
    flex: 1, backgroundColor: Colors.background.primary,
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  finishCard: {
    backgroundColor: '#1E293B', borderRadius: 28, padding: 32,
    alignItems: 'center', width: '100%',
    borderWidth: 1, borderColor: Colors.accent.greenSoft,
  },
  finishEmoji: { fontSize: 56, marginBottom: 12 },
  finishTitle: { color: Colors.text.primary, fontSize: 28, fontWeight: '800', marginBottom: 4 },
  finishSub: { color: Colors.map.label, fontSize: 14, marginBottom: 28 },
  finishStat: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', paddingVertical: 12,
    borderBottomWidth: 1, borderColor: Colors.ui.border,
  },
  finishStatLabel: { color: Colors.text.tertiary, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  finishStatValue: { color: Colors.accent.green, fontSize: 18, fontWeight: '800' },
  finishBtn: {
    backgroundColor: '#22C55E', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 40, marginTop: 24,
  },
  finishBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

// ─── Dark map style ────────────────────────────────────────────────────────────
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
];

// ─── Marker styles ─────────────────────────────────────────────────────────────

export const markerStyles = StyleSheet.create({
  pin: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  pinText: { fontSize: 12, fontWeight: '800' },
});