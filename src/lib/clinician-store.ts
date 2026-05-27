// Prototype-only clinician data + mock state

export type Clinician = {
  id: string;
  name: string;
  title: string;
  role: "Admin" | "Clinician";
  email: string;
  status: "Active" | "Pending" | "Archived";
  lastSignIn: string;
};

export const CLINICIANS: Clinician[] = [
  { id: "sarah-chen", name: "Dr. Sarah Chen", title: "Endocrinologist", role: "Admin", email: "s.chen@clinic.ca", status: "Active", lastSignIn: "Today" },
  { id: "james-okafor", name: "Dr. James Okafor", title: "Endocrinologist", role: "Clinician", email: "j.okafor@clinic.ca", status: "Active", lastSignIn: "3 days ago" },
  { id: "priya-mehta", name: "Nurse Priya Mehta", title: "Diabetes Nurse Educator", role: "Clinician", email: "p.mehta@clinic.ca", status: "Active", lastSignIn: "1 week ago" },
  { id: "lisa-bouchard", name: "Dr. Lisa Bouchard", title: "Endocrinologist", role: "Clinician", email: "l.bouchard@clinic.ca", status: "Pending", lastSignIn: "Never" },
  { id: "tom-park", name: "Dietician Tom Park", title: "Registered Dietician", role: "Clinician", email: "t.park@clinic.ca", status: "Active", lastSignIn: "2 weeks ago" },
  { id: "kevin-marsh", name: "Dr. Kevin Marsh", title: "Endocrinologist", role: "Clinician", email: "k.marsh@clinic.ca", status: "Archived", lastSignIn: "4 months ago" },
];

export const ROLE_REQUESTS = [
  { id: "james-okafor", name: "Dr. James Okafor" },
];
