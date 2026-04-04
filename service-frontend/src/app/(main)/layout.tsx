import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-50)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-[var(--spacing-lg)]">{children}</main>
    </div>
  );
}
