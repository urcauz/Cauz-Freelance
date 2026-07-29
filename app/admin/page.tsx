import { AdminDashboard } from "@/components/admin-dashboard";
import { getProjects } from "@/lib/projects";
import { getSiteContent } from "@/lib/site-content";
import { getTestimonials } from "@/lib/testimonials";

export const metadata = { title: "Cauz — Admin" };

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [projects, content, testimonials] = await Promise.all([getProjects(), getSiteContent(), getTestimonials()]);
  return <AdminDashboard projects={projects} content={content} testimonials={testimonials} />;
}
