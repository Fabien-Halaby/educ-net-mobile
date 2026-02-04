import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff, School, Book, BookOpen } from 'lucide-react-native';
import { schoolAPI, classAPI, subjectAPI, studentAPI, teacherAPI } from '../../lib/api';
import { SchoolItem, ClassItem, SubjectItem } from '../../lib/types'

export default function SignupScreen() {
  const params = useLocalSearchParams();
  const isStudent = params.role === 'student';
  
  const [step, setStep] = useState(1); // 1: Personnel, 2: École, 3: Classe/Sujets
  const [loading, setLoading] = useState(false);
  
  // Données formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Écoles + Classes/Sujets
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  const router = useRouter();

  // Load écoles au montage
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const { data } = await schoolAPI.getSchools();
      if (data.success) {
        setSchools(data.data);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les écoles');
    }
  };

  const loadSchoolData = async (school: SchoolItem) => {
    setSelectedSchool(school);
    try {
      if (isStudent) {
        const { data } = await classAPI.getClassesBySchool(school.id);
        if (data.success) setClasses(data.data);
      } else {
        const { data } = await subjectAPI.getSubjectsBySchool(school.id);
        if (data.success) setSubjects(data.data);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les classes/matières');
    }
  };

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleStudentSubmit = async () => {
  if (!selectedClassId) {
    Alert.alert('Erreur', 'Veuillez sélectionner une classe');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      school_slug: selectedSchool!.slug,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone,
      class_id: selectedClassId,
    };

    const response = await studentAPI.register(payload);
    if (response.data.success) {
      Alert.alert(
        'Succès', 
        response.data.message || 'Inscription réussie ! En attente validation admin.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    }
  } catch (error: any) {
    Alert.alert('Erreur', error.response?.data?.message || 'Erreur inscription');
  } finally {
    setLoading(false);
  }
};

const handleTeacherSubmit = async () => {
  if (selectedSubjects.length === 0) {
    Alert.alert('Erreur', 'Veuillez sélectionner au moins une matière');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      school_slug: selectedSchool!.slug,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone,
      subject_ids: selectedSubjects,
    };

    const response = await teacherAPI.register(payload);
    if (response.data.success) {
      Alert.alert(
        'Succès', 
        response.data.message || 'Inscription réussie ! En attente validation admin.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    }
  } catch (error: any) {
    Alert.alert('Erreur', error.response?.data?.message || 'Erreur inscription');
  } finally {
    setLoading(false);
  }
};

const handleSubmit = () => {
  if (!firstName || !lastName || !email || !password || !phone || !selectedSchool) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    return;
  }
  isStudent ? handleStudentSubmit() : handleTeacherSubmit();
};


  const nextStep = () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert('Erreur', 'Remplissez tous les champs personnels');
      return;
    }
    setStep(2);
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.title}>Étape 1/3</Text>
      <Text style={styles.subtitle}>Informations personnelles</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ny Aiko"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Mandresy"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="mandresy@gmail.com"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#A1A1AA" /> : <Eye size={20} color="#A1A1AA" />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+261 34 44 555 66"
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.title}>Étape 2/3</Text>
      <Text style={styles.subtitle}>Sélectionnez votre école</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>École</Text>
        <View style={styles.selectContainer}>
          <School size={20} color="#8B5CF6" />
          <TextInput
            style={styles.selectInput}
            placeholder="Sélectionnez une école"
            value={selectedSchool?.name}
            editable={false}
          />
          <TouchableOpacity>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {schools.map((school) => (
          <TouchableOpacity
            key={school.id}
            style={[styles.schoolItem, {borderColor: selectedSchool?.id === school.id ? '#8B5CF6' : '#2A2A2A',}]}
            onPress={() => loadSchoolData(school)}
          >
            <Text style={styles.schoolName}>{school.name}</Text>
            <Text style={styles.schoolSlug}>{school.slug}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.title}>Étape 3/3</Text>
      <Text style={styles.subtitle}>
        {isStudent ? 'Sélectionnez votre classe' : 'Sélectionnez vos matières'}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {isStudent ? 'Classe' : 'Matières'} ({selectedSchool?.name})
        </Text>
        
        {isStudent ? (
          classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={[
                styles.classItem,
                selectedClassId === cls.id && styles.selectedItem
              ]}
              onPress={() => setSelectedClassId(cls.id)}
            >
              <Book size={20} color="#8B5CF6" />
              <View>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classDetail}>{cls.level} {cls.section}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectItem,
                selectedSubjects.includes(subject.id) && styles.selectedItem
              ]}
              onPress={() => toggleSubject(subject.id)}
            >
              <BookOpen 
                size={20} 
                color={selectedSubjects.includes(subject.id) ? '#8B5CF6' : '#A1A1AA'} 
              />
              <View>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectCode}>{subject.code}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backLink}>← Retour accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  selectInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  dropdownIcon: {
    color: '#A1A1AA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  schoolItem: {
  backgroundColor: '#1A1A1A',
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#2A2A2A',
},
selectedSchoolItem: {
  backgroundColor: '#8B5CF6',
  borderColor: '#8B5CF6',
},
  schoolName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  schoolSlug: {
    color: '#A1A1AA',
    fontSize: 14,
    marginTop: 4,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  selectedItem: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  className: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  classDetail: {
    color: '#A1A1AA',
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  subjectName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  subjectCode: {
    color: '#A1A1AA',
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#10B981',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  backButton: {
    paddingVertical: 20,
  },
  backLink: {
    color: '#8B5CF6',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
