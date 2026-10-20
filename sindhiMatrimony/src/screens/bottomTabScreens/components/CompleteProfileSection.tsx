import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
  Line,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import fontFamily from '../../../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { Storage } from '../../../storage/Storage';

interface CompleteProfileSectionProps {
  score?: number;
  onAddPhoto?: () => void;
  onVerifyProfile?: () => void;
  onAddHoroscope?: () => void;
  onFamilyDetails?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 1. SVG ICONS
// -----------------------------------------------------------------------------

// Card 1: Add Photo(s) Icon
const AddPhotoIcon = () => (
  <Svg width={moderateScale(54)} height={moderateScale(54)} viewBox="0 0 52 52">
    <Defs>
      {/* Soft pastel green glow */}
      <SvgLinearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#F0FAF2" />
        <Stop offset="100%" stopColor="#D2F2DA" />
      </SvgLinearGradient>
    </Defs>

    {/* Outer squircle glow */}
    <Rect
      x="1"
      y="1"
      width="50"
      height="50"
      rx="16"
      ry="16"
      fill="url(#greenGlow)"
    />

    {/* Inner white framed box with dark border */}
    <Rect
      x="10"
      y="9"
      width="32"
      height="32"
      rx="9"
      ry="9"
      fill="#FFFFFF"
      stroke="#334155"
      strokeWidth="2.2"
    />

    {/* User Avatar silhouette in fresh green */}
    <Circle cx="26" cy="19.5" r="4.8" fill="#66BB6A" />
    <Path
      d="M 17.5 32 C 17.5 25 34.5 25 34.5 32 Z"
      fill="#66BB6A"
    />

    {/* Bottom-right cyan plus badge */}
    <Circle cx="38.5" cy="37.5" r="8.5" fill="#FFFFFF" />
    <Circle cx="38.5" cy="37.5" r="7.2" fill="#00BCD4" />
    {/* Plus sign */}
    <Line
      x1="35"
      y1="37.5"
      x2="42"
      y2="37.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="38.5"
      y1="34"
      x2="38.5"
      y2="41"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Card 2: Verify Profile Icon
const VerifyProfileIcon = () => (
  <Svg width={moderateScale(54)} height={moderateScale(54)} viewBox="0 0 52 52">
    <Defs>
      {/* Soft pastel blue glow */}
      <SvgLinearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#EFF6FE" />
        <Stop offset="100%" stopColor="#D5E8FD" />
      </SvgLinearGradient>
    </Defs>

    {/* Outer squircle glow */}
    <Rect
      x="1"
      y="1"
      width="50"
      height="50"
      rx="16"
      ry="16"
      fill="url(#blueGlow)"
    />

    {/* Inner white framed box with dark border */}
    <Rect
      x="10"
      y="9"
      width="32"
      height="32"
      rx="9"
      ry="9"
      fill="#FFFFFF"
      stroke="#334155"
      strokeWidth="2.2"
    />

    {/* ID Card details in slate blue */}
    <Circle cx="18.5" cy="20.5" r="3.4" fill="#7E9DBF" />
    <Rect x="24" y="19" width="10.5" height="3.2" rx="1.6" fill="#7E9DBF" />
    <Rect x="15" y="26.5" width="8.5" height="3.2" rx="1.6" fill="#7E9DBF" />
    <Rect x="25.5" y="26.5" width="9" height="3.2" rx="1.6" fill="#7E9DBF" />

    {/* Bottom-right blue checkmark badge */}
    <Circle cx="38.5" cy="37.5" r="8.5" fill="#FFFFFF" />
    <Circle cx="38.5" cy="37.5" r="7.2" fill="#0288D1" />
    {/* Checkmark */}
    <Path
      d="M 35.5 37.8 L 37.5 40 L 41.5 35.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Card 3 (Default): Add Horoscope Icon
const AddHoroscopeIcon = () => (
  <Svg width={moderateScale(54)} height={moderateScale(54)} viewBox="0 0 52 52">
    <Defs>
      {/* Soft pastel lavender glow */}
      <SvgLinearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#F8EFFE" />
        <Stop offset="100%" stopColor="#E9D6FC" />
      </SvgLinearGradient>
    </Defs>

    {/* Outer squircle glow */}
    <Rect
      x="1"
      y="1"
      width="50"
      height="50"
      rx="16"
      ry="16"
      fill="url(#purpleGlow)"
    />

    {/* Inner white framed box with dark border */}
    <Rect
      x="10"
      y="9"
      width="32"
      height="32"
      rx="9"
      ry="9"
      fill="#FFFFFF"
      stroke="#334155"
      strokeWidth="2.2"
    />

    {/* Planet Saturn body in violet */}
    <Circle cx="26" cy="24.5" r="6.8" fill="#CE93D8" />

    {/* Planet tilted ring with dark border */}
    <G transform="rotate(-28 26 24.5)">
      <Path
        d="M 14 24.5 C 14 21.6 38 21.6 38 24.5 C 38 27.4 14 27.4 14 24.5 Z"
        stroke="#334155"
        strokeWidth="1.9"
        fill="none"
      />
    </G>

    {/* Bottom-right cyan plus badge */}
    <Circle cx="38.5" cy="37.5" r="8.5" fill="#FFFFFF" />
    <Circle cx="38.5" cy="37.5" r="7.2" fill="#00BCD4" />
    {/* Plus sign */}
    <Line
      x1="35"
      y1="37.5"
      x2="42"
      y2="37.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="38.5"
      y1="34"
      x2="38.5"
      y2="41"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Card 3 (After Horoscope Generated): Family Details Icon
const FamilyDetailsIcon = ({ isCompleted }: { isCompleted?: boolean }) => (
  <Svg width={moderateScale(54)} height={moderateScale(54)} viewBox="0 0 52 52">
    <Defs>
      {/* Soft pastel peach/warm coral glow */}
      <SvgLinearGradient id="peachGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#FFF2EE" />
        <Stop offset="100%" stopColor="#FDE1DA" />
      </SvgLinearGradient>
    </Defs>

    {/* Outer squircle glow */}
    <Rect
      x="1"
      y="1"
      width="50"
      height="50"
      rx="16"
      ry="16"
      fill="url(#peachGlow)"
    />

    {/* Inner white framed box with dark border */}
    <Rect
      x="10"
      y="9"
      width="32"
      height="32"
      rx="9"
      ry="9"
      fill="#FFFFFF"
      stroke="#334155"
      strokeWidth="2.2"
    />

    {/* Father silhouette in coral */}
    <Circle cx="20" cy="18" r="3.2" fill="#EE5559" />
    <Path
      d="M 14.5 31 C 14.5 24.5 25.5 24.5 25.5 31 Z"
      fill="#EE5559"
    />

    {/* Mother silhouette in soft rose */}
    <Circle cx="31.5" cy="18.5" r="3" fill="#FF8A80" />
    <Path
      d="M 26.5 31 C 26.5 25.5 36.5 25.5 36.5 31 Z"
      fill="#FF8A80"
    />

    {/* Bottom-right badge: Cyan plus or Green check if completed */}
    <Circle cx="38.5" cy="37.5" r="8.5" fill="#FFFFFF" />
    <Circle cx="38.5" cy="37.5" r="7.2" fill={isCompleted ? '#4CAF50' : '#00BCD4'} />
    {isCompleted ? (
      <Path
        d="M 35.5 37.8 L 37.5 40 L 41.5 35.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ) : (
      <>
        <Line
          x1="35"
          y1="37.5"
          x2="42"
          y2="37.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Line
          x1="38.5"
          y1="34"
          x2="38.5"
          y2="41"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    )}
  </Svg>
);

// -----------------------------------------------------------------------------
// 2. MAIN COMPONENT
// -----------------------------------------------------------------------------

const CompleteProfileSection: React.FC<CompleteProfileSectionProps> = ({
  score = 52,
  onAddPhoto,
  onVerifyProfile,
  onAddHoroscope,
  onFamilyDetails,
  containerStyle,
}) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // Dynamically check whether Horoscope has been generated and Family Details completed
  const hasHoroscope = React.useMemo(() => {
    try {
      const val = Storage.getItemSync<any>('hasHoroscope');
      return val === true || val === 'true';
    } catch {
      return false;
    }
  }, [isFocused]);

  const hasFamilyDetails = React.useMemo(() => {
    try {
      const val = Storage.getItemSync<any>('hasFamilyDetails');
      return val === true || val === 'true';
    } catch {
      return false;
    }
  }, [isFocused]);

  // Dynamic profile completeness score
  const displayScore = hasFamilyDetails ? 84 : hasHoroscope ? 68 : score;

  const handleAddPhoto = () => {
    if (onAddPhoto) {
      onAddPhoto();
    } else {
      try {
        navigation.navigate('EditProfile');
      } catch {
        navigation.getParent()?.navigate('EditProfile');
      }
    }
  };

  const handleVerifyProfile = () => {
    if (onVerifyProfile) {
      onVerifyProfile();
    } else {
      try {
        navigation.navigate('VerifyYourProfile');
      } catch {
        navigation.getParent()?.navigate('VerifyYourProfile');
      }
    }
  };

  const handleAddHoroscope = () => {
    if (onAddHoroscope) {
      onAddHoroscope();
    } else {
      try {
        navigation.navigate('AddHoroscope');
      } catch {
        navigation.getParent()?.navigate('AddHoroscope');
      }
    }
  };

  const handleFamilyDetails = () => {
    if (onFamilyDetails) {
      onFamilyDetails();
    } else {
      try {
        navigation.navigate('FamilyDetails');
      } catch {
        navigation.getParent()?.navigate('FamilyDetails');
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Title */}
      <Text style={styles.title}>Complete Your Profile</Text>

      {/* Progress & Score Row */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>Profile completeness score</Text>
        <Text style={styles.scorePercent}>{displayScore}%</Text>

        {/* Horizontal Capsule Progress Bar */}
        <View style={styles.progressBarTrack}>
          <LinearGradient
            colors={['#E67300', '#FF9A00']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.progressBarFill, { width: `${Math.min(Math.max(displayScore, 0), 100)}%` }]}
          />
        </View>
      </View>

      {/* 3 Action Cards Row */}
      <View style={styles.cardsRow}>
        {/* Card 1: Add Photo(s) */}
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={handleAddPhoto}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel="Add Photo"
        >
          <AddPhotoIcon />
          <Text style={styles.cardLabel}>
            Add{'\n'}Photo(s)
          </Text>
        </TouchableOpacity>

        {/* Card 2: Verify Profile */}
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={handleVerifyProfile}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel="Verify Profile"
        >
          <VerifyProfileIcon />
          <Text style={styles.cardLabel}>
            Verify{'\n'}Profile
          </Text>
        </TouchableOpacity>

        {/* Card 3: Add Horoscope OR Family Details (once Horoscope generated) */}
        {hasHoroscope ? (
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={handleFamilyDetails}
            style={styles.card}
            accessibilityRole="button"
            accessibilityLabel="Family Details"
          >
            <FamilyDetailsIcon isCompleted={hasFamilyDetails} />
            <Text style={styles.cardLabel}>
              Family{'\n'}Details
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={handleAddHoroscope}
            style={styles.card}
            accessibilityRole="button"
            accessibilityLabel="Add Horoscope"
          >
            <AddHoroscopeIcon />
            <Text style={styles.cardLabel}>
              Add{'\n'}Horoscope
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CompleteProfileSection;

// -----------------------------------------------------------------------------
// 3. STYLES
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(14),
    marginTop: moderateVerticalScale(10),
    marginBottom: moderateVerticalScale(16),
  },
  title: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(17),
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(4),
  },
  scoreText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13),
    color: '#475569',
  },
  scorePercent: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13),
    color: '#0F172A',
    marginLeft: moderateScale(5),
  },
  progressBarTrack: {
    width: moderateScale(68),
    height: moderateVerticalScale(9),
    backgroundColor: '#F1F3F6',
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(9),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: moderateScale(5),
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
    marginTop: moderateVerticalScale(15),
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
    paddingHorizontal: moderateScale(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F2F6',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    marginTop: moderateVerticalScale(10),
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(13),
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: moderateScale(17),
  },
});
