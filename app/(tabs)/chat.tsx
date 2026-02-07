import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getToken, getUser } from '../../lib/auth';
import { chatWS } from '../../lib/websocket';
import { Message } from '../../lib/types';

export default function ChatScreen() {
  const { classId, className } = useLocalSearchParams();
  const classIdNum = parseInt(classId as string);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const setup = async () => {
      const token = await getToken();
      const user = await getUser();
      if (!token || !user?.id || !classIdNum) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      chatWS.onConnect(() => {
        setConnected(true);
        setLoading(false);
      });

      chatWS.onMessage((msg) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id);
          if(exists) {
            return prev;
          }
          
          return [...prev, msg];
        });
      });

      chatWS.connect(classIdNum, token);
    };

    setup();
    return () => chatWS.disconnect();
  }, [classIdNum]);

  const sendMessage = () => {
    if(newMessage.trim() && connected) {
      chatWS.send(newMessage.trim());
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.user.id === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.otherMessage
      ]}>
        {!isMe && (
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#8B5CF6" />
          </View>
        )}
        <View style={[styles.bubble, isMe && styles.myBubble]}>
          <Text style={[
            styles.userName,
            isMe && styles.myUserName
          ]}>
            {item.user.full_name}
          </Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={[
            styles.time,
            isMe && styles.myTime
          ]}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  if(loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Connexion Terminale S...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={24} color="#8B5CF6" />
        <Text style={styles.classTitle}>{className || 'Classe'}</Text>
        <View style={[
          styles.status,
          connected ? styles.connected : styles.disconnected
        ]}>
          <Ionicons 
            name={connected ? "checkmark-circle" : "time-outline"} 
            size={20} 
            color={connected ? "#10B981" : "#F59E0B"} 
          />
          <Text style={styles.statusText}>
            {connected ? 'Connecté' : 'Déconnecté'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        style={styles.messagesList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez un message..."
          placeholderTextColor="#A1A1AA"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || !connected) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || !connected}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={newMessage.trim() && connected ? "#FFFFFF" : "#A1A1AA"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#A1A1AA',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
  },
  connected: {
    backgroundColor: '#10B98120',
  },
  disconnected: {
    backgroundColor: '#F59E0B20',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  myMessage: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
  },
  myBubble: {
    backgroundColor: '#8B5CF6',
  },
  userName: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  myUserName: {
    color: '#E9D5FF',
  },
  content: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 4,
    textAlign: 'right',
  },
  myTime: {
    color: '#E9D5FF',
  },
  otherMessage: {
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#2A2A2A',
  },
});