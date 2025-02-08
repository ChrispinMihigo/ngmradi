export interface Project<T> {
  id: string;
  title: string;
  description?: string;
  uid: string;
  contributor?: string[];
  createdAt: T;
  updatedAt: T;
}
