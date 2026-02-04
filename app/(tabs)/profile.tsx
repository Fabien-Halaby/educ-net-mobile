import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileAPI } from '../../lib/api';
import { Profile } from '../../lib/types';
import { clearAuth } from '../../lib/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await profileAPI.getProfile();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER AVATAR */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color="#A1A1AA" />
            </View>
          )}
          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="camera" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.fullName}>{profile?.full_name}</Text>
        <Text style={styles.role}>{profile?.role === 'student' ? 'Élève' : 'Professeur'}</Text>
      </View>

      {/* STATUS CARD */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusDot,
            { backgroundColor: profile?.status === 'approved' ? '#10B981' : '#F59E0B' }
          ]} />
          <Text style={styles.statusText}>
            {profile?.status === 'approved' ? 'Approuvé' : 'En attente'}
          </Text>
        </View>
      </View>

      {/* INFO CARDS */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#A1A1AA" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#A1A1AA" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{profile?.phone || 'Non renseigné'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="school" size={20} color="#A1A1AA" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>École ID</Text>
            <Text style={styles.infoValue}>#{profile?.school_id}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </View>
      </View>

      {/* ACTIONS */}
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
        <Text style={styles.actionText}>Paramètres</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#8B5CF6',
  },
  avatarPlaceholder: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  role: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
