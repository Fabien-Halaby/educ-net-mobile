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