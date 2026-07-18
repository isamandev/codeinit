export type JobType = "remote" | "fulltime" | "contract" | "startup";

export type JobPosition = "junior" | "midlevel" | "senior";

export type Job = {
  id: number;
  company: string;
  title: string;
  description: string;
  location: string;
  city: string;
  position: JobPosition;
  tags: string[];
  posted: string;
  salary: string;
  icon: string;
  url: string;
  type: JobType;
};
