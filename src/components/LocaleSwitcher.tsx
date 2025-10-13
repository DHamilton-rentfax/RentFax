"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth, updateUserLocale } from "@/hooks/use-auth";

export function LocaleSwitcher() {
  const router = useRouter();
  const path = usePathname();
  const { user } = useAuth();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    if (user?.uid) {
      await updateUserLocale(user.uid, newLocale);
    }

    router.push(`/${newLocale}${path.replace(/^\/(en|es)/, "")}`);
  };

  return (
    <select
      onChange={handleChange}
      defaultValue="en"
      className="p-2 border rounded-md text-sm"
    >
      <option value="en">🇺🇸 English</option>
      <option value="es">🇪🇸 Español</option>
    </select>
  );
}
