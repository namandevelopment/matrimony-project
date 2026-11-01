import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Linking,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../../utils/Responsive';
import { clientPhoneNumber } from '../../utils/ClientData';
import { showToast } from '../../utils/CustomToast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const QUICK_PROMPTS = [
  { id: '1', label: '💎 Upgrade & Prime Plans' },
  { id: '2', label: '🪪 Photo & ID Verification' },
  { id: '3', label: '⭐ Gotra & Kundli Milan' },
  { id: '4', label: '📞 Request Relationship Manager' },
  { id: '5', label: '🔒 Privacy & Photo Shield' },
];

const BOT_RESPONSES: Record<string, string> = {
  '1': 'Our Prime Members get 3x more profile views, direct contact unlocks, and dedicated Relationship Manager support! Would you like to view our latest 71% OFF discount plans?',
  '2': 'Profiles with Blue Verified Badges receive 80% higher responses. You can verify your profile instantly by uploading a Govt ID in the Verify Profile section under your Profile tab.',
  '3': 'Sindhi Matrimony features built-in 36 Guna Milan and ancestral Gotra matching to ensure harmonious family alignment according to authentic Sindhi traditions.',
  '4': 'We have noted your request! A dedicated Senior Relationship Manager will call you at your registered mobile number within 15–30 minutes.',
  '5': 'Your safety is our priority. You can enable "Visible to Contacted Only" or "Photo Blur" from Settings > Privacy Options at any time.',
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'support',
    text: 'Welcome to Sindhi Matrimony 24x7 Customer Support Desk!',
    timestamp: 'Just now',
    status: 'read',
  },
  {
    id: 'm2',
    sender: 'support',
    text: 'I am your dedicated relationship assistant. How can we help you find your ideal life partner today?',
    timestamp: 'Just now',
    status: 'read',
  },
];

const SupportChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCallSupport = useCallback(() => {
    const phone = clientPhoneNumber || '9672446220';
    Linking.openURL(`tel:+91${phone}`).catch(() => {
      showToast({
        type: 'error',
        message: 'Could not open phone dialer.',
      });
    });
  }, []);

  const sendBotReply = useCallback((replyText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `support_${Date.now()}`,
          sender: 'support',
          text: replyText,
          timestamp: formatCurrentTime(),
          status: 'read',
        },
      ]);
      setIsTyping(false);
    }, 1100);
  }, []);

  const handleSendMessage = useCallback(
    (customText?: string) => {
      const textToSend = (customText || inputText).trim();
      if (!textToSend) return;

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: formatCurrentTime(),
        status: 'read',
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!customText) setInputText('');

      const lower = textToSend.toLowerCase();
      let reply =
        'Thank you for reaching out! Our executive has noted your inquiry and will assist you shortly. You can also tap the phone icon at the top right to speak directly.';

      if (lower.includes('prime') || lower.includes('upgrade') || lower.includes('membership') || lower.includes('plan')) {
        reply = BOT_RESPONSES['1'];
      } else if (lower.includes('photo') || lower.includes('verify') || lower.includes('id') || lower.includes('badge')) {
        reply = BOT_RESPONSES['2'];
      } else if (lower.includes('kundli') || lower.includes('gotra') || lower.includes('guna')) {
        reply = BOT_RESPONSES['3'];
      } else if (lower.includes('call') || lower.includes('manager') || lower.includes('relationship')) {
        reply = BOT_RESPONSES['4'];
      } else if (lower.includes('privacy') || lower.includes('blur') || lower.includes('hide')) {
        reply = BOT_RESPONSES['5'];
      }

      sendBotReply(reply);
    },
    [inputText, sendBotReply],
  );

  const handlePromptPress = useCallback(
    (promptId: string, label: string) => {
      const userText = label.replace(/^[^\s]+\s*/, '');
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: formatCurrentTime(),
        status: 'read',
      };

      setMessages((prev) => [...prev, userMsg]);
      sendBotReply(
        BOT_RESPONSES[promptId] ||
          'We have noted your interest! Our relationship manager is reviewing your profile and will assist you momentarily.',
      );
    },
    [sendBotReply],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const renderMessageItem = useCallback(({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowSupport,
        ]}
      >
        {!isUser && (
          <View style={styles.supportAvatar}>
            <CustomLucidIcons name="headphones" size={14} color="#FFFFFF" />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleSupport,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextSupport,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.timeText,
                isUser ? styles.timeTextUser : styles.timeTextSupport,
              ]}
            >
              {item.timestamp}
            </Text>
            {isUser && (
              <CustomLucidIcons
                name="check-check"
                size={13}
                color="#FFFFFF"
                style={styles.checkIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#DB2F3C" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <CustomLucidIcons name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerAvatarWrapper}>
          <View style={styles.headerAvatar}>
            <CustomLucidIcons name="headphones" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.onlineBadge} />
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Customer Support
          </Text>
          <View style={styles.headerStatusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.headerSubtitle}>Online • Instant Response</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.78}
          onPress={handleCallSupport}
          style={styles.callBtn}
          accessibilityLabel="Call support helpline"
        >
          <CustomLucidIcons name="phone" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingContainer}>
              <View style={styles.supportAvatar}>
                <CustomLucidIcons name="headphones" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#DB2F3C" />
                <Text style={styles.typingText}>Support is typing...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick Action Suggestion Chips */}
      <View style={styles.chipsWrapper}>
        <FlatList
          horizontal
          data={QUICK_PROMPTS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.chip}
              onPress={() => handlePromptPress(item.id, item.label)}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Keyboard Avoiding Bottom Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask anything about matches, plans..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!inputText.trim()}
              style={[
                styles.sendBtn,
                inputText.trim() ? styles.sendBtnActive : styles.sendBtnDisabled,
              ]}
              onPress={() => handleSendMessage()}
            >
              <CustomLucidIcons
                name="send"
                size={18}
                color={inputText.trim() ? '#FFFFFF' : '#94A3B8'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupportChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: moderateVerticalScale(58),
    backgroundColor: '#DB2F3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backBtn: {
    padding: moderateScale(6),
    marginRight: moderateScale(6),
  },
  headerAvatarWrapper: {
    position: 'relative',
    marginRight: moderateScale(10),
  },
  headerAvatar: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(11),
    height: moderateScale(11),
    borderRadius: moderateScale(5.5),
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#DB2F3C',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(15.5),
    color: '#FFFFFF',
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 5,
  },
  headerSubtitle: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11),
    color: '#FEE2E2',
  },
  callBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(6),
  },
  listContent: {
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateVerticalScale(16),
    paddingBottom: moderateVerticalScale(12),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: moderateVerticalScale(12),
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowSupport: {
    justifyContent: 'flex-start',
  },
  supportAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#DB2F3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
    marginBottom: moderateVerticalScale(2),
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(10),
    borderRadius: moderateScale(16),
  },
  bubbleUser: {
    backgroundColor: '#DB2F3C',
    borderBottomRightRadius: moderateScale(3),
    shadowColor: '#DB2F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleSupport: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: moderateScale(3),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  messageText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13.5),
    lineHeight: moderateScale(19),
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextSupport: {
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: moderateVerticalScale(4),
  },
  timeText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(10),
  },
  timeTextUser: {
    color: '#FEE2E2',
  },
  timeTextSupport: {
    color: '#94A3B8',
  },
  checkIcon: {
    marginLeft: moderateScale(4),
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(4),
    marginBottom: moderateVerticalScale(12),
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#64748B',
    marginLeft: moderateScale(8),
  },
  chipsWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: moderateVerticalScale(8),
  },
  chipsContent: {
    paddingHorizontal: moderateScale(12),
  },
  chip: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(6),
    borderRadius: moderateScale(18),
    marginRight: moderateScale(8),
  },
  chipText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(11.5),
    color: '#BE123C',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(8),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    minHeight: moderateVerticalScale(40),
    maxHeight: moderateVerticalScale(95),
    backgroundColor: '#F1F5F9',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(8),
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13.5),
    color: '#0F172A',
  },
  sendBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  sendBtnActive: {
    backgroundColor: '#DB2F3C',
    shadowColor: '#DB2F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
});

