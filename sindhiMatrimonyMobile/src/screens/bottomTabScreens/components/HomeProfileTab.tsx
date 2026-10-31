import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { fontFamily } from '../../../components/fontFamily'
import { COLORS } from '../../../components/colors'
import CustomLucidIcons from '../../../components/CustomLucidIcons'
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive'
import CelebratingBanner from './CelebratingBanner'

const HomeProfileTab = ({
  onPressPrime,
  onPressBanner,
}: {
  onPressPrime?: () => void
  onPressBanner?: () => void
}) => {
  const navigation = useNavigation<any>()
  return (
    <LinearGradient
      colors={['#F7FFEA', '#F0FAE0', '#EFFFF4']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.profileHeader}>

      <View style={styles.topSection}>
        {/* Regular / Prime */}
        <View style={styles.planToggle}>
          <View style={styles.regularTab}>
            <Text style={styles.regularText}>Regular</Text>
          </View>

          <TouchableOpacity onPress={onPressPrime} style={styles.primeTab}>
            <Text style={styles.primeText}>PRIME</Text>
            <View style={styles.primeDot} />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileInfo}>
          <Pressable
            style={styles.avatarWrapper}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>

            <Pressable style={styles.cameraButton}>
              <CustomLucidIcons
                name="camera"
                color={COLORS.black}
                size={moderateScale(10)}
              />
            </Pressable>
          </Pressable>

          <View style={styles.userInfo}>
            <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                Mayank Tamhankar
              </Text>
            </Pressable>

            <View style={styles.memberRow}>
              <Text style={styles.memberText}>Free Member</Text>

              <Pressable
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('Upgrade')}
              >
                <LinearGradient
                  colors={['#F7D98D', '#B79555']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeGradient}>
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
          {/* Right Actions */}
          <View style={styles.headerActions}>
            <Pressable hitSlop={10} onPress={() => navigation.navigate('NotificationScreen')}>
              <CustomLucidIcons
                name="bell"
                color={COLORS.black}
                size={moderateScale(22)}
              />
            </Pressable>

            <Pressable hitSlop={10} onPress={() => navigation.navigate('ProfileScreen')}>
              <CustomLucidIcons
                name="menu"
                color={COLORS.black}
                size={moderateScale(24)}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Celebrating 26 Years of Matchmaking Banner */}
      {/* <CelebratingBanner onPress={onPressBanner} /> */}
    </LinearGradient>
  )
}

export default HomeProfileTab

const styles = StyleSheet.create({
  profileHeader: {
    borderRadius: moderateScale(16),
    // marginBottom: moderateVerticalScale(14),
    overflow: 'hidden',
  },
  topSection: {
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateVerticalScale(16),
    paddingBottom: moderateVerticalScale(6),
  },

  planToggle: {
    alignSelf: 'center',
    width: '62%',
    maxWidth: moderateScale(230),
    minWidth: moderateScale(180),
    height: moderateVerticalScale(30),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  regularTab: {
    flex: 1,
    backgroundColor: '#D9363E',
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  regularText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(11),
  },

  primeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primeText: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(13),
  },

  primeDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: '#D9363E',
    marginLeft: 2,
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(9),
  },

  avatarWrapper: {
    width: moderateScale(52),
    height: moderateScale(52),
    position: 'relative',
    marginRight: moderateScale(10),
  },

  avatar: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: moderateScale(1.5),
    borderColor: '#E8E8E8',
  },

  avatarText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(22),
    color: '#E5A044',
  },

  cameraButton: {
    position: 'absolute',
    left: 0,
    bottom: moderateVerticalScale(-1),
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(14),
  },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(2),
  },

  memberText: {
    color: '#333',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(10),
  },

  upgradeButton: {
    height: moderateVerticalScale(25),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    borderColor: '#B79555',
    marginLeft: moderateScale(7),
    overflow: 'hidden',
  },

  upgradeGradient: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  upgradeText: {
    color: 'white',
    // color: '#9B7938',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(12),
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(15),
    marginLeft: moderateScale(8),
  },
})