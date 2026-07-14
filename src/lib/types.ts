export type Post = {
  id: number;
  title: string;
  description: string | null;
  text: string | null;
  price: number | null;
  city: string | null;
  metro?: string | null; 
  image: string | null;
  user: string | null; 
  user_id: string | null; 
  categoryId: string | null;
  created_at: string | null;
  phone: string | null;
};