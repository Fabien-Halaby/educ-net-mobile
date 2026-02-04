export interface SchoolItem {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  status: string;
}

export interface ClassItem {
  id: number;
  name: string;
  level: string;
  section: string;
  capacity: number;
  academic_year: string;
}

export interface SubjectItem {
  id: number;
  name: string;
  code: string;
  description: string;
}



export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  school_id: number;
  avatar_url?: string;
  created_at: string;
}

export interface ClassListResponse {
  success: any;
  data: any;
  classes: ClassItem[];
  total: number;
}

export interface SubjectListResponse {
  success: any;
  data: any;
  subjects: SubjectItem[];
  total: number;
}
