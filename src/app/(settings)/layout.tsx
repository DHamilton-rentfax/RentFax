import Protected from '@/components/protected';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account and company settings.',
};

const sidebarNavItems = [
  {
    title: 'Team',
    href: '/settings/team',
  },
  {
    title: 'Rules & Branding',
    href: '/settings/rules',
  },
  {
    title: 'Billing',
    href: '/settings/billing',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Protected roles={['owner', 'manager']}>
      <div className="container mx-auto p-4 md:p-10">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your company account settings and team members.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </Protected>
  );
}
