import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileAPI } from '../../lib/api';
import { ClassItem, SubjectItem, Profile } from '../../lib/types';
import { useRouter } from 'expo-router';

export default function ClassesScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profile pour rôle
      const profileRes = await profileAPI.getProfile();
      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
        
        // Load classes/subjects selon rôle
        if (profileRes.data.data.role === 'student') {
          const classesRes = await profileAPI.getMyClasses();
          if (classesRes.data.success) {
            setClasses(classesRes.data.data.classes);
          }
        } else {
          const subjectsRes = await profileAPI.getMySubjects();
          if (subjectsRes.data.success) {
            setSubjects(subjectsRes.data.data.subjects);
          }
        }
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const renderClassCard = (cls: ClassItem) => (
    <TouchableOpacity key={cls.id} style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Ionicons name="school" size={32} color="#8B5CF6" />
        <View>
          <Text style={styles.cardTitle}>{cls.name}</Text>
          <Text style={styles.cardSubtitle}>{cls.level} - {cls.section}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.capacity}>Capacité: {cls.capacity}</Text>
        <Text style={styles.academicYear}>{cls.academic_year}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSubjectCard = (subject: SubjectItem) => (
    <TouchableOpacity key={subject.id} style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Ionicons name="book" size={32} color="#8B5CF6" />
        <View>
          <Text style={styles.cardTitle}>{subject.name}</Text>
          <Text style={styles.cardSubtitle}>{subject.code}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.description}>{subject.description || 'Aucune description'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {profile?.role === 'student' ? 'Mes Classes' : 'Mes Matières'}
      </Text>

      {profile?.role === 'student' ? (
        classes.length > 0 ? (
          classes.map(renderClassCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#A1A1AA" />
            <Text style={styles.emptyText}>Aucune classe assignée</Text>
          </View>
        )
      ) : (
        subjects.length > 0 ? (
          subjects.map(renderSubjectCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#A1A1AA" />
            <Text style={styles.emptyText}>Aucune matière assignée</Text>
          </View>
        )
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#A1A1AA',
  },
  cardFooter: {
    marginTop: 12,
  },
  capacity: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  academicYear: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#A1A1AA',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
