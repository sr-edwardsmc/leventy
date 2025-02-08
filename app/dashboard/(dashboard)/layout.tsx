import PrivateLayout from "@/layouts/PrivateLayout";

function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return <PrivateLayout>{children}</PrivateLayout>;
}

export default DashboardLayout;
