import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import fontFamily from '../components/fontFamily';

interface TimeWheelPickerModalProps {
  visible: boolean;
  initialTime?: string; // e.g. "12:00 PM" or "00:00"
  onConfirm: (formattedTime: string, hour: number, minute: number, ampm: 'AM' | 'PM') => void;
  onCancel: () => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return h < 10 ? `0${h}` : `${h}`;
}); // ['01', '02', ..., '12']

const MINUTES = Array.from({ length: 60 }, (_, i) => {
  return i < 10 ? `0${i}` : `${i}`;
}); // ['00', '01', ..., '59']

const AMPM_LIST = ['AM', 'PM'];

const TimeWheelPickerModal: React.FC<TimeWheelPickerModalProps> = ({
  visible,
  initialTime = '12:00 PM',
  onConfirm,
  onCancel,
}) => {
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedAmPm, setSelectedAmPm] = useState<'AM' | 'PM'>('PM');

  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);
  const ampmListRef = useRef<FlatList>(null);

  // Parse initial time
  useEffect(() => {
    if (visible && initialTime) {
      const match = initialTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1], 10);
        let m = match[2];
        let ap = (match[3] || 'AM').toUpperCase() as 'AM' | 'PM';

        if (!match[3]) {
          // 24 hour conversion
          if (h >= 12) {
            ap = 'PM';
            if (h > 12) h -= 12;
          } else {
            ap = 'AM';
            if (h === 0) h = 12;
          }
        }
        const hStr = h < 10 ? `0${h}` : `${h}`;
        setSelectedHour(hStr);
        setSelectedMinute(m);
        setSelectedAmPm(ap);

        // Scroll to indexes after render
        setTimeout(() => {
          const hIndex = HOURS.indexOf(hStr);
          if (hIndex >= 0 && hourListRef.current) {
            hourListRef.current.scrollToOffset({
              offset: hIndex * ITEM_HEIGHT,
              animated: false,
            });
          }
          const mIndex = MINUTES.indexOf(m);
          if (mIndex >= 0 && minuteListRef.current) {
            minuteListRef.current.scrollToOffset({
              offset: mIndex * ITEM_HEIGHT,
              animated: false,
            });
          }
          const aIndex = AMPM_LIST.indexOf(ap);
          if (aIndex >= 0 && ampmListRef.current) {
            ampmListRef.current.scrollToOffset({
              offset: aIndex * ITEM_HEIGHT,
              animated: false,
            });
          }
        }, 150);
      }
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    const formatted = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;
    const hNum = parseInt(selectedHour, 10);
    const mNum = parseInt(selectedMinute, 10);
    onConfirm(formatted, hNum, mNum, selectedAmPm);
  };

  const renderColumn = (
    data: string[],
    selectedVal: string,
    onSelect: (val: any) => void,
    listRef: React.RefObject<FlatList | null>,
  ) => {
    // Add 1 empty item before and after for alignment
    const paddedData = ['', ...data, ''];

    const handleMomentumScrollEnd = (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
      onSelect(data[clampedIndex]);
    };

    return (
      <View style={styles.columnContainer}>
        <FlatList
          ref={listRef as any}
          data={paddedData}
          keyExtractor={(item, index) => `${item}_${index}`}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          renderItem={({ item, index }) => {
            const isPad = item === '';
            const isSelected = item === selectedVal;
            return (
              <TouchableOpacity
                activeOpacity={isPad ? 1 : 0.7}
                disabled={isPad}
                onPress={() => {
                  if (!isPad) {
                    onSelect(item);
                    const originalIdx = index - 1;
                    if (originalIdx >= 0 && listRef.current) {
                      listRef.current.scrollToOffset({
                        offset: originalIdx * ITEM_HEIGHT,
                        animated: true,
                      });
                    }
                  }
                }}
                style={styles.itemWrapper}
              >
                <Text
                  style={[
                    styles.wheelItemText,
                    isSelected ? styles.wheelItemSelectedText : styles.wheelItemDimText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          style={styles.sheetContainer}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {/* Header Title: "Time of birth for horoscope: 12:00 PM" */}
          <View style={styles.titleRow}>
            <Text style={styles.titleLabel}>
              Time of birth for horoscope:{' '}
              <Text style={styles.titleValue}>
                {selectedHour}:{selectedMinute} {selectedAmPm}
              </Text>
            </Text>
          </View>

          {/* Column Header Titles: Hour | Minute | Am/Pm */}
          <View style={styles.columnHeadersRow}>
            <Text style={styles.columnHeaderTitle}>Hour</Text>
            <Text style={styles.columnHeaderTitle}>Minute</Text>
            <Text style={styles.columnHeaderTitle}>Am/Pm</Text>
          </View>

          {/* Wheel Selector with central highlight band */}
          <View style={styles.wheelSectionWrapper}>
            {/* Top and Bottom selection border lines */}
            <View pointerEvents="none" style={styles.selectionIndicator} />

            <View style={styles.wheelsRow}>
              {/* Hour Wheel */}
              {renderColumn(HOURS, selectedHour, setSelectedHour, hourListRef)}

              {/* Minute Wheel */}
              {renderColumn(
                MINUTES,
                selectedMinute,
                setSelectedMinute,
                minuteListRef,
              )}

              {/* AM/PM Wheel */}
              {renderColumn(
                AMPM_LIST,
                selectedAmPm,
                setSelectedAmPm,
                ampmListRef,
              )}
            </View>
          </View>

          {/* Bottom Action Buttons: CANCEL / SET */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnText}>SET</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default TimeWheelPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'android' ? 44 : 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  titleRow: {
    marginBottom: 16,
  },
  titleLabel: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
  },
  titleValue: {
    fontSize: 16,
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Bold,
  },
  columnHeadersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  columnHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#94A3B8',
    fontFamily: fontFamily.Inter18Medium,
  },
  wheelSectionWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    justifyContent: 'center',
    marginVertical: 4,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  wheelsRow: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  columnContainer: {
    flex: 1,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    textAlign: 'center',
  },
  wheelItemSelectedText: {
    fontSize: 22,
    color: '#1E293B',
    fontFamily: fontFamily.Inter18Bold,
  },
  wheelItemDimText: {
    fontSize: 18,
    color: '#CBD5E1',
    fontFamily: fontFamily.Inter18Medium,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionBtnText: {
    fontSize: 15,
    color: '#00838F', // Teal color matching user reference image
    fontFamily: fontFamily.Inter18Bold,
    letterSpacing: 0.5,
  },
});
