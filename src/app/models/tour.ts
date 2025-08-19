export interface Tour {
  id?: string | number | null;
  title?: string | null;
  description?: string | null;
  duration?: string | null;
  groupSize?: number | null;
  images?: string | null;
  departureDate?: string | null;
  departurePlace?: string | null;
  price?: number | null;
  highlights?: string | null;
}

export interface TourDescription {
  title: string;
  description: string;
  image: string;
}
