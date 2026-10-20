import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Rect, Line, Polygon, Text as SvgText } from 'react-native-svg';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { Storage } from '../../storage/Storage';

// -----------------------------------------------------------------------------
// VEDIC KUNDLI CHART (North Indian Diamond Chart)
// -----------------------------------------------------------------------------
interface VedicChartProps {
  size: number;
  houses: {
    num: number; // House / Rasi number
    planets: { text: string; color: string }[];
  }[];
}

const VedicChart: React.FC<VedicChartProps> = ({ size, houses }) => {
  const S = size;
  const H = S / 2;
  const Q = S / 4;
  const TQ = (3 * S) / 4;

  // Pre-calculated centers for house numbers and planet text
  const houseLayout = useMemo(
    () => [
      // House 1 (Top diamond)
      { numX: H, numY: Q - 6, pX: H, pY: Q + 10 },
      // House 2 (Top-left triangle)
      { numX: Q + 4, numY: Q - 12, pX: Q - 4, pY: Q - 4 },
      // House 3 (Far-left upper triangle)
      { numX: Q - 12, numY: Q + 4, pX: Q - 12, pY: Q + 20 },
      // House 4 (Left diamond)
      { numX: Q + 8, numY: H - 4, pX: Q - 4, pY: H + 12 },
      // House 5 (Far-left lower triangle)
      { numX: Q - 12, numY: TQ - 6, pX: Q - 12, pY: TQ + 12 },
      // House 6 (Bottom-left triangle)
      { numX: Q + 4, numY: TQ + 18, pX: Q - 4, pY: TQ + 6 },
      // House 7 (Bottom diamond)
      { numX: H, numY: TQ + 18, pX: H, pY: TQ + 2 },
      // House 8 (Bottom-right triangle)
      { numX: TQ - 6, numY: TQ + 18, pX: TQ + 6, pY: TQ + 6 },
      // House 9 (Far-right lower triangle)
      { numX: TQ + 14, numY: TQ - 6, pX: TQ + 14, pY: TQ + 12 },
      // House 10 (Right diamond)
      { numX: TQ - 8, numY: H - 4, pX: TQ + 6, pY: H + 12 },
      // House 11 (Far-right upper triangle)
      { numX: TQ + 14, numY: Q + 4, pX: TQ + 14, pY: Q + 20 },
      // House 12 (Top-right triangle)
      { numX: TQ - 6, numY: Q - 12, pX: TQ + 6, pY: Q - 4 },
    ],
    [H, Q, TQ],
  );

  return (
    <Svg width={S} height={S} style={{ backgroundColor: '#FFFDF5' }}>
      {/* Outer border */}
      <Rect
        x={1}
        y={1}
        width={S - 2}
        height={S - 2}
        stroke="#E69500"
        strokeWidth={1.5}
        fill="none"
      />

      {/* Diagonals */}
      <Line x1={0} y1={0} x2={S} y2={S} stroke="#E69500" strokeWidth={1.2} />
      <Line x1={0} y1={S} x2={S} y2={0} stroke="#E69500" strokeWidth={1.2} />

      {/* Center Diamond connecting midpoints: (H,0) -> (S,H) -> (H,S) -> (0,H) */}
      <Polygon
        points={`${H},0 ${S},${H} ${H},${S} 0,${H}`}
        stroke="#E69500"
        strokeWidth={1.2}
        fill="none"
      />

      {/* Houses labels & planets */}
      {houses.map((h, idx) => {
        const layout = houseLayout[idx];
        if (!layout) return null;
        return (
          <React.Fragment key={`h_${idx}`}>
            {/* House / Rasi Number in amber/brown */}
            <SvgText
              x={layout.numX}
              y={layout.numY}
              fontSize={8.5}
              fill="#B45309"
              textAnchor="middle"
              fontWeight="bold"
            >
              {h.num}
            </SvgText>

            {/* Planets in house */}
            {h.planets.map((p, pIdx) => (
              <SvgText
                key={`p_${idx}_${pIdx}`}
                x={layout.pX + (pIdx > 0 ? (pIdx % 2 === 1 ? 14 : -14) : 0)}
                y={layout.pY + Math.floor(pIdx / 2) * 11}
                fontSize={8.5}
                fill={p.color}
                textAnchor="middle"
                fontWeight="bold"
              >
                {p.text}
              </SvgText>
            ))}
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

// -----------------------------------------------------------------------------
// MAIN HOROSCOPE SCREEN
// -----------------------------------------------------------------------------

const HoroscopeView: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Zoom control state (1.0 = normal, 1.15 = 115%, 0.9 = 90%)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Accordion collapse states
  const [papapointsOpen, setPapapointsOpen] = useState(true);
  const [longitudesOpen, setLongitudesOpen] = useState(true);
  const [dashaOpen, setDashaOpen] = useState(true);

  // Read stored user or route params
  const rawUser = Storage.getItemSync<any>('user');
  let user: any = null;
  if (typeof rawUser === 'string') {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  } else if (rawUser && typeof rawUser === 'object') {
    user = rawUser;
  }
  const candidateName =
    route.params?.candidateName ||
    user?.firstName ||
    'Mayank Tamhankar';

  const dateOfBirthStr =
    route.params?.dateOfBirthStr || '12 April 1995, Wednesday';
  const timeOfBirthStr = route.params?.timeOfBirthStr || '12:00:00 PM';
  const placeOfBirth = route.params?.placeOfBirth || 'Ajmer';

  // 1. Rasi Chart Configuration (Matching user screenshot)
  const rasiHouses = [
    { num: 3, planets: [{ text: 'Lag', color: '#16A34A' }, { text: 'Gul', color: '#16A34A' }] }, // House 1
    { num: 4, planets: [{ text: 'Mar', color: '#DC2626' }] }, // House 2
    { num: 5, planets: [{ text: 'Rah', color: '#16A34A' }] }, // House 3
    { num: 6, planets: [] }, // House 4
    { num: 7, planets: [] }, // House 5
    { num: 8, planets: [{ text: 'Jup', color: '#9333EA' }] }, // House 6
    { num: 9, planets: [] }, // House 7
    { num: 10, planets: [] }, // House 8
    { num: 11, planets: [{ text: 'Ven', color: '#9333EA' }, { text: 'Sat', color: '#2563EB' }] }, // House 9
    { num: 12, planets: [{ text: 'Sun', color: '#0284C7' }, { text: 'Mer', color: '#2563EB' }] }, // House 10
    { num: 1, planets: [{ text: 'Ket', color: '#16A34A' }] }, // House 11
    { num: 2, planets: [{ text: 'Moo', color: '#2563EB' }] }, // House 12
  ];

  // 2. Navamsa Chart Configuration (Matching user screenshot)
  const navamsaHouses = [
    { num: 4, planets: [{ text: 'Lag', color: '#16A34A' }, { text: 'Gul', color: '#16A34A' }] }, // House 1
    { num: 5, planets: [] }, // House 2
    { num: 6, planets: [] }, // House 3
    { num: 7, planets: [{ text: 'Rah', color: '#16A34A' }] }, // House 4
    { num: 8, planets: [{ text: 'Ven', color: '#DC2626' }, { text: 'Sat', color: '#2563EB' }] }, // House 5
    { num: 9, planets: [{ text: 'Mer', color: '#2563EB' }] }, // House 6
    { num: 10, planets: [{ text: 'Sun', color: '#0284C7' }] }, // House 7
    { num: 11, planets: [{ text: 'Jup', color: '#9333EA' }, { text: 'Mar', color: '#DC2626' }] }, // House 8
    { num: 12, planets: [] }, // House 9
    { num: 1, planets: [] }, // House 10
    { num: 2, planets: [{ text: 'Ket', color: '#16A34A' }] }, // House 11
    { num: 3, planets: [{ text: 'Moo', color: '#2563EB' }] }, // House 12
  ];

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.15, 1.45));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.15, 0.85));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Red Header matching Sindhi Matrimony App */}
      <CustomHeader
        title="Horoscope"
        backgroundColor="#EE5559"
        titleColor="#FFFFFF"
        backIconColor="#FFFFFF"
        statusBarColor="#EE5559"
        statusBarStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { transform: [{ scale: zoomLevel }] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Document Card */}
        <View style={styles.cardContainer}>
          {/* Header Title */}
          <Text style={styles.candidateTitle}>
            Horoscope of {candidateName}
          </Text>

          {/* Subtitle */}
          <Text style={styles.candidateSubtitle}>
            Suklapaksha, Purvaphalguni Nakshatra (Pada 1), Simha Rasi
          </Text>

          {/* ------------------------------------------------------------- */}
          {/* KUNDLI CHARTS CONTAINER (Rasi & Navamsa)                       */}
          {/* ------------------------------------------------------------- */}
          <View style={styles.chartsWrapper}>
            {/* Titles row */}
            <View style={styles.chartTitlesRow}>
              <View style={styles.chartTitleCol}>
                <Text style={styles.chartTitleText}>Rasi (Birth Chart)</Text>
              </View>
              <View style={styles.chartTitleCol}>
                <Text style={styles.chartTitleText}>Navamsa</Text>
              </View>
            </View>

            {/* Side-by-side Charts */}
            <View style={styles.chartsRow}>
              <View style={styles.chartCol}>
                <VedicChart size={156} houses={rasiHouses} />
              </View>
              <View style={styles.chartCol}>
                <VedicChart size={156} houses={navamsaHouses} />
              </View>
            </View>

            {/* Dasa balance at birth */}
            <Text style={styles.dasaBalanceText}>
              Dasa balance at birth = Shukra 16 Years, 7 Months, 13 Days.
            </Text>
          </View>

          {/* ------------------------------------------------------------- */}
          {/* COMPACT ASTROLOGICAL METADATA TEXT BLOCK                       */}
          {/* ------------------------------------------------------------- */}
          <View style={styles.metadataBlock}>
            <Text style={styles.metadataText}>
              <Text style={styles.metaBold}>Sex: </Text>Male |{' '}
              <Text style={styles.metaBold}>Date of Birth: </Text>
              {dateOfBirthStr} |{' '}
              <Text style={styles.metaBold}>Time of Birth (Hr.Min.Sec): </Text>
              {timeOfBirthStr} , Standard Time |{' '}
              <Text style={styles.metaBold}>Time Zone (Hrs.Mins): </Text>
              05:30 East of Greenwich |{' '}
              <Text style={styles.metaBold}>Time Correction: </Text>
              Standard Time |{' '}
              <Text style={styles.metaBold}>Place of Birth: </Text>
              {placeOfBirth} | <Text style={styles.metaBold}>Ayanamsa: </Text>
              Chitra Paksha | <Text style={styles.metaBold}>Birth Star: </Text>
              Purvaphalguni <Text style={styles.metaBold}>Star Pada: </Text>1 |{' '}
              <Text style={styles.metaBold}>Birth Rasi: </Text>Simha |{' '}
              <Text style={styles.metaBold}>Lagna: </Text>Mithuna{' '}
              <Text style={styles.metaBold}>Lagna Lord: </Text>Budha |{' '}
              <Text style={styles.metaBold}>Thidhi: </Text>Dwadasi,
              Suklapaksha
            </Text>
          </View>

          {/* ------------------------------------------------------------- */}
          {/* ACCORDION 1: PAPAPOINTS                                       */}
          {/* ------------------------------------------------------------- */}
          <View style={styles.accordionContainer}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setPapapointsOpen(!papapointsOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>Papapoints</Text>
              <View style={styles.collapseIconBox}>
                <Text style={styles.collapseIconText}>
                  {papapointsOpen ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>

            {papapointsOpen && (
              <View style={styles.tableBorderWrapper}>
                {/* Header Row 1 */}
                <View style={styles.tableRowHeader}>
                  <View style={[styles.cell, { flex: 1.2 }]}>
                    <Text style={styles.headerCellText}>Planet</Text>
                  </View>
                  <View style={[styles.cell, { flex: 2 }]}>
                    <Text style={styles.headerCellText}>From Lagna</Text>
                  </View>
                  <View style={[styles.cell, { flex: 2 }]}>
                    <Text style={styles.headerCellText}>From Chandra</Text>
                  </View>
                  <View style={[styles.cell, { flex: 2 }]}>
                    <Text style={styles.headerCellText}>From Sukra</Text>
                  </View>
                </View>

                {/* Subheader Row 2 */}
                <View style={styles.tableRowSubheader}>
                  <View style={[styles.cell, { flex: 1.2 }]}>
                    <Text style={styles.subCellText} />
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Position</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Points</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Position</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Points</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Position</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1 }]}>
                    <Text style={styles.subCellText}>Points</Text>
                  </View>
                </View>

                {/* Data Rows */}
                {[
                  { planet: 'Mars', lPos: '2', lPt: '1.0', cPos: '12', cPt: '1.0', sPos: '6', sPt: '0.0' },
                  { planet: 'Saturn', lPos: '9', lPt: '0.0', cPos: '7', cPt: '1.0', sPos: '1', sPt: '1.0' },
                  { planet: 'Sun', lPos: '10', lPt: '0.0', cPos: '8', cPt: '1.0', sPos: '2', sPt: '1.0' },
                  { planet: 'Rahu', lPos: '5', lPt: '0.0', cPos: '3', cPt: '0.0', sPos: '9', sPt: '0.0' },
                  { planet: 'Total', lPos: '', lPt: '1.0', cPos: '', cPt: '3.0', sPos: '', sPt: '2.0', isBold: true },
                ].map((row, i) => (
                  <View
                    key={`papa_${i}`}
                    style={[
                      styles.tableRow,
                      i % 2 === 1 && styles.tableRowAlt,
                    ]}
                  >
                    <View style={[styles.cell, { flex: 1.2 }]}>
                      <Text
                        style={[
                          styles.cellTextLeft,
                          row.isBold && styles.boldText,
                        ]}
                      >
                        {row.planet}
                      </Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text style={styles.cellText}>{row.lPos}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text
                        style={[
                          styles.cellText,
                          row.isBold && styles.boldText,
                        ]}
                      >
                        {row.lPt}
                      </Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text style={styles.cellText}>{row.cPos}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text
                        style={[
                          styles.cellText,
                          row.isBold && styles.boldText,
                        ]}
                      >
                        {row.cPt}
                      </Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text style={styles.cellText}>{row.sPos}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                      <Text
                        style={[
                          styles.cellText,
                          row.isBold && styles.boldText,
                        ]}
                      >
                        {row.sPt}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Dosha Summary */}
                <View style={styles.doshaBox}>
                  <View style={styles.doshaRow}>
                    <Text style={styles.doshaLabel}>Kuja Dosha</Text>
                    <Text style={styles.doshaValue}>Slight dosha</Text>
                  </View>
                  <View style={styles.doshaRow}>
                    <Text style={styles.doshaLabel}>Rahu Dosha</Text>
                    <Text style={styles.doshaValue}>No Dosha</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ------------------------------------------------------------- */}
          {/* ACCORDION 2: NIRAYANA LONGITUDE OF PLANETS                    */}
          {/* ------------------------------------------------------------- */}
          <View style={styles.accordionContainer}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setLongitudesOpen(!longitudesOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>
                Nirayana Longitude of Planets
              </Text>
              <View style={styles.collapseIconBox}>
                <Text style={styles.collapseIconText}>
                  {longitudesOpen ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>

            {longitudesOpen && (
              <View style={styles.tableBorderWrapper}>
                {/* Explanatory Paragraph */}
                <Text style={styles.tableExplanationText}>
                  The Indian system of Astrology is based on the Nirayana
                  Longitude of planets, which is obtained by subtracting the
                  ayanamsa value from the Sayan longitudes, calculated as per
                  western system. There are different basis for calculating
                  ayanamsa. The method selected here is : Chitra Paksha =
                  23:47:37
                </Text>

                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                  <View style={[styles.cell, { flex: 1.3 }]}>
                    <Text style={styles.headerCellText}>Planet</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.4 }]}>
                    <Text style={styles.headerCellText}>Longitude</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.4 }]}>
                    <Text style={styles.headerCellText}>Rasi</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.7 }]}>
                    <Text style={styles.headerCellText}>Longitude in Rasi</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.4 }]}>
                    <Text style={styles.headerCellText}>Retrograde</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.8 }]}>
                    <Text style={styles.headerCellText}>Star</Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.1 }]}>
                    <Text style={styles.headerCellText}>Quarter</Text>
                  </View>
                </View>

                {/* 11 Planet Rows */}
                {[
                  { planet: 'Lagna', long: '88:2:40', rasi: 'Mithuna', inRasi: '28:2:40', retro: '', star: 'Punarvasu', quarter: '3' },
                  { planet: 'Moon', long: '135:35:14', rasi: 'Simha', inRasi: '15:35:14', retro: '', star: 'Purvaphalguni', quarter: '1' },
                  { planet: 'Sun', long: '358:6:2', rasi: 'Meena', inRasi: '28:6:2', retro: '', star: 'Revati', quarter: '4' },
                  { planet: 'Mercury', long: '355:37:22', rasi: 'Meena', inRasi: '25:37:22', retro: '', star: 'Revati', quarter: '3' },
                  { planet: 'Venus', long: '324:16:31', rasi: 'Kumbha', inRasi: '24:16:31', retro: '', star: 'Purvabhadra', quarter: '2' },
                  { planet: 'Mars', long: '111:18:21', rasi: 'Karkata', inRasi: '21:18:21', retro: '', star: 'Ashlesha', quarter: '2' },
                  { planet: 'Jupiter', long: '231:24:32', rasi: 'Vrischika', inRasi: '21:24:32', retro: 'Retro', star: 'Jyeshta', quarter: '2' },
                  { planet: 'Saturn', long: '325:37:49', rasi: 'Kumbha', inRasi: '25:37:49', retro: '', star: 'Purvabhadra', quarter: '2' },
                  { planet: 'Rahu', long: '192:36:39', rasi: 'Tula', inRasi: '12:36:39', retro: '', star: 'Swati', quarter: '2' },
                  { planet: 'Ketu', long: '12:36:39', rasi: 'Mesha', inRasi: '12:36:39', retro: '', star: 'Aswini', quarter: '4' },
                  { planet: 'Gulikan', long: '89:29:11', rasi: 'Mithuna', inRasi: '29:29:11', retro: '', star: 'Punarvasu', quarter: '3' },
                ].map((row, i) => (
                  <View
                    key={`nira_${i}`}
                    style={[
                      styles.tableRow,
                      i % 2 === 1 && styles.tableRowAlt,
                    ]}
                  >
                    <View style={[styles.cell, { flex: 1.3 }]}>
                      <Text style={styles.cellTextLeft}>{row.planet}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.4 }]}>
                      <Text style={styles.cellText}>{row.long}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.4 }]}>
                      <Text style={styles.cellText}>{row.rasi}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.7 }]}>
                      <Text style={styles.cellText}>{row.inRasi}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.4 }]}>
                      <Text style={styles.cellText}>{row.retro}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.8 }]}>
                      <Text style={styles.cellText}>{row.star}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.1 }]}>
                      <Text style={styles.cellText}>{row.quarter}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ------------------------------------------------------------- */}
          {/* ACCORDION 3: VIMSHOTTARI DASHA                                */}
          {/* ------------------------------------------------------------- */}
          <View style={styles.accordionContainer}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setDashaOpen(!dashaOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.accordionTitle}>Vimshottari Dasha</Text>
              <View style={styles.collapseIconBox}>
                <Text style={styles.collapseIconText}>
                  {dashaOpen ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>

            {dashaOpen && (
              <View style={styles.tableBorderWrapper}>
                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                  <View style={[styles.cell, { flex: 1.3 }]}>
                    <Text style={styles.headerCellText}>Maha-Antar</Text>
                  </View>
                  <View style={[styles.cell, { flex: 2.7 }]}>
                    <Text style={styles.headerCellText}>
                      Start Date - End Date
                    </Text>
                  </View>
                  <View style={[styles.cell, { flex: 1.3 }]}>
                    <Text style={styles.headerCellText}>Maha-Antar</Text>
                  </View>
                  <View style={[styles.cell, { flex: 2.7 }]}>
                    <Text style={styles.headerCellText}>
                      Start Date - End Date
                    </Text>
                  </View>
                </View>

                {/* 20 Dasha Period Pairs */}
                {[
                  ['Ven-Sat', '23-09-2004 - 24-11-2007', 'Moo-Sun', '25-05-2027 - 24-11-2027'],
                  ['Ven-Mer', '24-11-2007 - 24-09-2010', 'Mar-Mar', '24-11-2027 - 21-04-2028'],
                  ['Ven-Ket', '24-09-2010 - 24-11-2011', 'Mar-Rah', '21-04-2028 - 10-05-2029'],
                  ['Sun-Sun', '24-11-2011 - 13-03-2012', 'Mar-Jup', '10-05-2029 - 16-04-2030'],
                  ['Sun-Moo', '13-03-2012 - 11-09-2012', 'Mar-Sat', '16-04-2030 - 25-05-2031'],
                  ['Sun-Mar', '11-09-2012 - 17-01-2013', 'Mar-Mer', '25-05-2031 - 22-05-2032'],
                  ['Sun-Rah', '17-01-2013 - 12-12-2013', 'Mar-Ket', '22-05-2032 - 18-10-2032'],
                  ['Sun-Jup', '12-12-2013 - 30-09-2014', 'Mar-Ven', '18-10-2032 - 18-12-2033'],
                  ['Sun-Sat', '30-09-2014 - 12-09-2015', 'Mar-Sun', '18-12-2033 - 25-04-2034'],
                  ['Sun-Mer', '12-09-2015 - 19-07-2016', 'Mar-Moo', '25-04-2034 - 24-11-2034'],
                  ['Sun-Ket', '19-07-2016 - 23-11-2016', 'Rah-Rah', '24-11-2034 - 06-08-2037'],
                  ['Sun-Ven', '23-11-2016 - 24-11-2017', 'Rah-Jup', '06-08-2037 - 31-12-2039'],
                  ['Moo-Moo', '24-11-2017 - 24-09-2018', 'Rah-Sat', '31-12-2039 - 06-11-2042'],
                  ['Moo-Mar', '24-09-2018 - 25-04-2019', 'Rah-Mer', '06-11-2042 - 25-05-2045'],
                  ['Moo-Rah', '25-04-2019 - 24-10-2020', 'Rah-Ket', '25-05-2045 - 12-06-2046'],
                  ['Moo-Jup', '24-10-2020 - 23-02-2022', 'Rah-Ven', '12-06-2046 - 12-06-2049'],
                  ['Moo-Sat', '23-02-2022 - 24-09-2023', 'Rah-Sun', '12-06-2049 - 07-05-2050'],
                  ['Moo-Mer', '24-09-2023 - 23-02-2025', 'Rah-Moo', '07-05-2050 - 06-11-2051'],
                  ['Moo-Ket', '23-02-2025 - 24-09-2025', 'Rah-Mar', '06-11-2051 - 23-11-2052'],
                  ['Moo-Ven', '24-09-2025 - 25-05-2027', '', ''],
                ].map((row, i) => (
                  <View
                    key={`dasha_${i}`}
                    style={[
                      styles.tableRow,
                      i % 2 === 1 && styles.tableRowAlt,
                    ]}
                  >
                    <View style={[styles.cell, { flex: 1.3 }]}>
                      <Text style={styles.cellText}>{row[0]}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 2.7 }]}>
                      <Text style={styles.cellText}>{row[1]}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 1.3 }]}>
                      <Text style={styles.cellText}>{row[2]}</Text>
                    </View>
                    <View style={[styles.cell, { flex: 2.7 }]}>
                      <Text style={styles.cellText}>{row[3]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ------------------------------------------------------------- */}
          {/* ABBREVIATION LEGEND FOOTER                                    */}
          {/* ------------------------------------------------------------- */}
          <Text style={styles.legendFooterText}>
            Sun-Sun, Moo-Moon, Mar-Mars, Mer-Mercury, Rah-Rahu, Ket-Ketu,
            Ven-Venus, Sat-Saturn, Jup-Jupiter, Lag-Lagna, Gul-Gulikan
          </Text>
        </View>
      </ScrollView>

      {/* ----------------------------------------------------------------- */}
      {/* FLOATING ZOOM CONTROL PILL (Bottom Right)                          */}
      {/* ----------------------------------------------------------------- */}
      <View style={styles.floatingZoomPill}>
        <TouchableOpacity
          onPress={handleZoomOut}
          style={styles.zoomButton}
          activeOpacity={0.7}
        >
          <CustomLucidIcons name="zoom-out" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity
          onPress={handleZoomIn}
          style={styles.zoomButton}
          activeOpacity={0.7}
        >
          <CustomLucidIcons name="zoom-in" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HoroscopeView;

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingBottom: 80,
    backgroundColor: '#FFFFFD',
  },
  cardContainer: {
    paddingHorizontal: 8,
    paddingTop: 14,
  },
  candidateTitle: {
    fontSize: 18,
    color: '#334155',
    fontFamily: fontFamily.Inter18Black,
    textAlign: 'center',
    marginBottom: 4,
  },
  candidateSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    textAlign: 'center',
    marginBottom: 12,
  },

  // Charts
  chartsWrapper: {
    backgroundColor: '#FFFDF5',
    borderColor: '#F3E5AB',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  chartTitlesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chartTitleCol: {
    flex: 1,
    alignItems: 'center',
  },
  chartTitleText: {
    fontSize: 12,
    color: '#B45309',
    fontFamily: fontFamily.Inter18Black,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  chartCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dasaBalanceText: {
    fontSize: 10.5,
    color: '#475569',
    fontFamily: fontFamily.Inter18Medium,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

  // Metadata Block
  metadataBlock: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  metadataText: {
    fontSize: 9.8,
    color: '#334155',
    fontFamily: fontFamily.Inter18Regular,
    lineHeight: 14.5,
  },
  metaBold: {
    fontFamily: fontFamily.Inter18Black,
    color: '#0F172A',
  },

  // Accordion
  accordionContainer: {
    marginBottom: 10,
  },
  accordionHeader: {
    backgroundColor: '#C8E6C9', // light sage green
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  accordionTitle: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Black,
    color: '#1B5E20',
  },
  collapseIconBox: {
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#81C784',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  collapseIconText: {
    fontSize: 11,
    lineHeight: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },

  // Table styles
  tableBorderWrapper: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  tableExplanationText: {
    fontSize: 9.5,
    color: '#4B5563',
    fontFamily: fontFamily.Inter18Regular,
    lineHeight: 13.5,
    padding: 6,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableRowSubheader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  cell: {
    paddingVertical: 3.5,
    paddingHorizontal: 2,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  headerCellText: {
    fontSize: 8.5,
    color: '#334155',
    fontFamily: fontFamily.Inter18Black,
    textAlign: 'center',
  },
  subCellText: {
    fontSize: 8,
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    textAlign: 'center',
  },
  cellText: {
    fontSize: 8.5,
    color: '#1E293B',
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'center',
  },
  cellTextLeft: {
    fontSize: 8.5,
    color: '#1E293B',
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'left',
    paddingLeft: 4,
  },
  boldText: {
    fontFamily: fontFamily.Inter18Black,
  },

  // Dosha
  doshaBox: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  doshaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 1.5,
  },
  doshaLabel: {
    fontSize: 9,
    color: '#334155',
    fontFamily: fontFamily.Inter18Black,
    width: 80,
    textAlign: 'right',
  },
  doshaValue: {
    fontSize: 9,
    color: '#475569',
    fontFamily: fontFamily.Inter18Regular,
    width: 80,
    textAlign: 'left',
  },

  // Legend
  legendFooterText: {
    fontSize: 8.5,
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  // Floating Zoom Widget
  floatingZoomPill: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  zoomButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  zoomDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
});
