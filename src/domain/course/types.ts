export type CourseSession = {
  id: string;
  classPlanId: string;
  order: number;
  /** Optional label, e.g. "Week 1" */
  label?: string;
};

export type Course = {
  id: string;
  title: string;
  description?: string;
  sessions: CourseSession[];
  createdAt: string;
  updatedAt: string;
};

export type CourseDraft = {
  title: string;
  description?: string;
  sessions: CourseSession[];
};

export type CourseValidationError = {
  field: 'title' | 'description' | 'sessions';
  message: string;
};
