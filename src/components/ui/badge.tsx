export const Badge = ({ children, variant }: { children: React.ReactNode, variant: string }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${variant === 'outline' ? 'border' : ''}`}>
      {children}
    </span>
  );
};