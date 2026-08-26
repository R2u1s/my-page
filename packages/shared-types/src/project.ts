export interface Project {
  id: string;
  title: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  isPlaceholder: boolean;
  sortOrder: number;
}
