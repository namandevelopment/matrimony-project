import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

const { width } = Dimensions.get('window');

export interface MobilePromotionalPopup {
    id: string;
    popupId?: string;
    title: string;
    subtitle?: string;
    message: string;
    bannerUrl?: string;
    bannerImageUrl?: string;
    originalPrice?: number;
    discountedPrice?: number;
    discountLabel?: string;
    couponCode?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface PromotionalPopupModalProps {
    visible: boolean;
    popup: MobilePromotionalPopup | null;
    onClose: () => void;
    onCtaPress: (popup: MobilePromotionalPopup) => void;
}

const PromotionalPopupModal: React.FC<PromotionalPopupModalProps> = memo(({
    visible,
    popup,
    onClose,
    onCtaPress,
}) => {
    if (!popup) return null;

    const banner = popup.bannerImageUrl || popup.bannerUrl;

    return (
        <Modal
            isVisible={visible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropColor={COLORS.black}
            backdropOpacity={0.65}
            backdropTransitionOutTiming={0}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            useNativeDriver
            useNativeDriverForBackdrop
            style={styles.modal}
        >
            <View style={styles.card}>
                {/* [X] Close Button (Triggers Daily Dismissal) */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <CustomLucidIcons
                        name="X"
                        size={18}
                        color={COLORS.white}
                    />
                </TouchableOpacity>

                {/* Banner Header */}
                {banner ? (
                    <View style={styles.bannerContainer}>
                        <Image
                            source={{ uri: banner }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        {popup.discountLabel ? (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountBadgeText}>
                                    {popup.discountLabel}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {/* Body Content */}
                <View style={styles.contentContainer}>
                    {popup.subtitle ? (
                        <View style={styles.subtitleBadge}>
                            <Text style={styles.subtitleText}>{popup.subtitle}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.titleText}>{popup.title}</Text>

                    <Text style={styles.messageText} numberOfLines={3}>
                        {popup.message}
                    </Text>

                    {/* Pricing Row */}
                    {popup.discountedPrice ? (
                        <View style={styles.pricingBox}>
                            {popup.originalPrice ? (
                                <Text style={styles.originalPriceText}>
                                    ₹{Number(popup.originalPrice).toLocaleString('en-IN')}
                                </Text>
                            ) : null}
                            <Text style={styles.discountedPriceText}>
                                ₹{Number(popup.discountedPrice).toLocaleString('en-IN')}
                            </Text>
                            {popup.couponCode ? (
                                <View style={styles.couponBadge}>
                                    <Text style={styles.couponText}>{popup.couponCode}</Text>
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    {/* CTA Button */}
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => onCtaPress(popup)}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.ctaButtonText}>
                            {popup.ctaText || 'Claim Offer Now'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.dayCapHint}>
                        Tap ✕ to silence this offer for today
                    </Text>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width * 0.88,
        maxWidth: 340,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#1E293B',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: COLORS.themeColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    discountBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    subtitleBadge: {
        backgroundColor: '#FEF3C7',
        borderColor: '#FDE68A',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        marginBottom: 8,
    },
    subtitleText: {
        color: '#92400E',
        fontSize: 10,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '800',
    },
    titleText: {
        fontSize: 16,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 22,
    },
    messageText: {
        fontSize: 12,
        fontFamily: fontFamily.Inter18Regular,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 14,
    },
    pricingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    originalPriceText: {
        fontSize: 12,
        fontFamily: fontFamily.Inter18Regular,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    discountedPriceText: {
        fontSize: 18,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '900',
        color: '#059669',
    },
    couponBadge: {
        backgroundColor: '#FFE4E6',
        borderColor: '#FECDD3',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    couponText: {
        fontSize: 10,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '800',
        color: '#BE123C',
    },
    ctaButton: {
        width: '100%',
        backgroundColor: COLORS.themeColor,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.themeColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    ctaButtonText: {
        color: COLORS.white,
        fontSize: 13,
        fontFamily: fontFamily.Inter18Bold,
        fontWeight: '900',
    },
    dayCapHint: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 8,
        fontFamily: fontFamily.Inter18Medium,
    },
});

export default PromotionalPopupModal;
