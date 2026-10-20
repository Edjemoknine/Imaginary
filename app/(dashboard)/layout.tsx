import SiteShell from "@/components/core/SiteShell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell variant="dashboard">{children}</SiteShell>;
}
