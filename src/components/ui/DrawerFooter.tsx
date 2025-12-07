export function DrawerFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-2">
      {children}
    </div>
  );
}
