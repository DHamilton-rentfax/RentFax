export function BrandWrapper({ tenant, children }) {
  const styles = {
    "--primary": tenant.branding?.primaryColor || "#2D77FF",
    "--secondary": tenant.branding?.secondaryColor || "#1A1A1A"
  };

  return <div style={styles}>{children}</div>;
}
