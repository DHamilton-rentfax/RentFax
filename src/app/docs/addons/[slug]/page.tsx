import { getAddonBySlug } from "@/lib/addons-data";
import { addonCategories } from "../navigation";
import { notFound } from "next/navigation";
import AddOnDetailClientPage from "./AddOnDetailClientPage";

export function generateStaticParams() {
  return addonCategories.flatMap((c) => c.items.map((i) => ({ slug: i.slug })));
}

export default function AddOnDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const addon = getAddonBySlug(params.slug);
  if (!addon) return notFound();

  // flatten all items for next/prev nav
  const allItems = addonCategories.flatMap((c) => c.items);
  const currentIndex = allItems.findIndex((i) => i.slug === addon.slug);
  const prevAddon = allItems[currentIndex - 1];
  const nextAddon = allItems[currentIndex + 1];

  return (
    <AddOnDetailClientPage
      addon={addon}
      prevAddon={prevAddon}
      nextAddon={nextAddon}
    />
  );
}
