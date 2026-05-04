export type Vacancy = {
  id: string;
  created_at?: string;
  updated_at?: string;
  reference_number: string;
  slug: string;
  title: string;
  location: string;
  contract_type?: string;
  hours: number;
  salary_min: string;
  salary_max: string;
  category?: string;
  description?: string;
  responsibilities: string[];
  offer: string[];
  about_employer?: string;
  requirements_intro?: string;
  requirements: string[];
  published: boolean;
};

export type ApplicationStatus = 'Nieuw' | 'In behandeling' | 'Aangenomen' | 'Afgewezen';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Nieuw',
  'In behandeling',
  'Aangenomen',
  'Afgewezen',
];

export type Application = {
  id: string;
  created_at?: string;
  vacancy_id?: string;
  vacancy_title?: string;
  vacancy_reference?: string;
  vacancy_location?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  country?: string;
  postal_code?: string;
  house_number?: string;
  date_of_birth?: string;
  email: string;
  phone: string;
  motivation?: string;
  cv_url?: string;
  cv_filename?: string;
  status?: ApplicationStatus;
  status_updated_at?: string;
};
