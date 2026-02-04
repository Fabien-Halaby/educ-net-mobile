import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassItem, SchoolItem, SubjectItem } from './types';

const API_BASE = 'http://192.168.201.145:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

//! Intercepteur JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const schoolAPI = {
  getSchools: () => api.get<{ success: boolean; data: SchoolItem[] }>('/schools'),
};

export const classAPI = {
  getClassesBySchool: (schoolId: number) =>
    api.get<{ success: boolean; data: ClassItem[] }>(`/classes/${schoolId}`),
};

export const subjectAPI = {
  getSubjectsBySchool: (schoolId: number) =>
    api.get<{ success: boolean; data: SubjectItem[] }>(`/subjects/${schoolId}`),
};

export const studentAPI = {
  register: (data: {
    school_slug: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    class_id: number;
  }) => api.post('/students/register', data),
  
  getClasses: () => api.get<{ success: boolean; data: ClassItem[] }>('/student/classes'),
};

export const teacherAPI = {
  register: (data: {
    school_slug: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    subject_ids: number[];
  }) => api.post('/teachers/register', data),
};

export default api;
