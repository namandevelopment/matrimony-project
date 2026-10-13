import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

interface PrimeModalProps {
    visible: boolean;
    onClose?: () => void;
    onAddPhoto?: () => void;
    step?: number;
    totalSteps?: number;
}

const PrimeModal: React.FC<PrimeModalProps> = memo(({
    visible,
    onClose,
    onAddPhoto,
    step = 1,
    totalSteps = 2,
}) => (
    <Modal
        isVisible={visible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={COLORS.black}
        backdropOpacity={0.6}
        backdropTransitionOutTiming={0}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        statusBarTranslucent
        useNativeDriver
        useNativeDriverForBackdrop
        style={styles.modal}
    >
        <View style={styles.container}>
            {/* Top Handle Indicator */}
            <View style={styles.dragHandle} />

            {/* Header Row: Step Pill + Modern Circle Close Button */}
            <View style={styles.header}>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepText}>{`Step ${step} of ${totalSteps}`}</Text>
                </View>

                <TouchableOpacity
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    onPress={onClose}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                >
                    <CustomLucidIcons name="x" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Visual Focal Point: Layered Ring Photo & Prime Accents */}
            <View style={styles.iconSection}>
                <View style={styles.outerRing}>
                    <View style={styles.innerRing}>
                        <CustomLucidIcons
                            name="image-plus"
                            size={38}
                            color={COLORS.themeColor}
                        />
                    </View>

                    {/* Floating Crown Badge */}
                    <View style={styles.crownBadge}>
                        <CustomLucidIcons name="crown" size={13} color="#B45309" />
                    </View>

                    {/* Floating Camera Action Badge */}
                    <View style={styles.cameraBadge}>
                        <CustomLucidIcons name="camera" size={14} color={COLORS.white} />
                    </View>
                </View>
            </View>

            {/* Headline & Description */}
            <Text style={styles.title}>
                It is mandatory to add your{`\n`}photo to view Prime matches.
            </Text>

            <Text style={styles.message}>
                Just two more steps before you{`\n`}view Prime matches.
            </Text>

            {/* Trust & Privacy Badge */}
            <View style={styles.trustBadge}>
                <CustomLucidIcons name="shield-check" size={14} color="#059669" />
                <Text style={styles.trustText}>100% Privacy & Verification Protected</Text>
            </View>

            {/* Primary CTA Button */}
            <TouchableOpacity
                accessibilityLabel="Add your photo"
                accessibilityRole="button"
                activeOpacity={0.88}
                onPress={onAddPhoto}
                style={styles.addPhotoButton}
            >
                <Text style={styles.addPhotoText}>Add Your Photo</Text>
                <CustomLucidIcons name="arrow-right" size={18} color={COLORS.white} />
            </TouchableOpacity>

            {/* Secondary Dismiss Action */}
            <TouchableOpacity
                accessibilityLabel="Dismiss for now"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
                onPress={onClose}
                style={styles.dismissButton}
                activeOpacity={0.7}
            >
                <Text style={styles.dismissText}>I'll do it later</Text>
            </TouchableOpacity>
        </View>
    </Modal>
));

export default PrimeModal;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 30,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    dragHandle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        marginBottom: 14,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    stepBadge: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    stepText: {
        color: COLORS.themeColor,
        fontFamily: fontFamily.Inter18SemiBold,
        fontSize: 12,
        letterSpacing: 0.2,
    },
    closeButton: {
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        height: 32,
        justifyContent: 'center',
        width: 32,
    },
    iconSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 18,
    },
    outerRing: {
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderColor: '#FED7AA',
        borderRadius: 52,
        borderWidth: 2,
        height: 104,
        justifyContent: 'center',
        position: 'relative',
        width: 104,
    },
    innerRing: {
        alignItems: 'center',
        backgroundColor: '#FFF1F2',
        borderRadius: 42,
        height: 84,
        justifyContent: 'center',
        width: 84,
    },
    crownBadge: {
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 2,
        height: 28,
        justifyContent: 'center',
        left: -4,
        position: 'absolute',
        top: -4,
        width: 28,
    },
    cameraBadge: {
        alignItems: 'center',
        backgroundColor: COLORS.themeColor,
        borderColor: COLORS.white,
        borderRadius: 15,
        borderWidth: 2.5,
        bottom: 0,
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        width: 30,
    },
    title: {
        color: '#111827',
        fontFamily: fontFamily.Inter18Bold,
        fontSize: 19,
        lineHeight: 27,
        textAlign: 'center',
    },
    message: {
        color: '#6B7280',
        fontFamily: fontFamily.Inter18Regular,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
        textAlign: 'center',
    },
    trustBadge: {
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderColor: '#DCFCE7',
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    trustText: {
        color: '#15803D',
        fontFamily: fontFamily.Inter18Medium,
        fontSize: 12,
        marginLeft: 6,
    },
    addPhotoButton: {
        alignItems: 'center',
        backgroundColor: COLORS.themeColor,
        borderRadius: 28,
        elevation: 4,
        flexDirection: 'row',
        height: 52,
        justifyContent: 'center',
        marginTop: 22,
        paddingHorizontal: 22,
        shadowColor: COLORS.themeColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        width: '100%',
    },
    addPhotoText: {
        color: COLORS.white,
        fontFamily: fontFamily.Inter18Bold,
        fontSize: 16,
        marginRight: 8,
    },
    dismissButton: {
        marginTop: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dismissText: {
        color: '#9CA3AF',
        fontFamily: fontFamily.Inter18Medium,
        fontSize: 13,
    },
});