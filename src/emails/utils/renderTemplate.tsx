import { render } from "@react-email/render";

/**
 * Renders a React email template into HTML.
 */
export function renderEmail(Component: any, props: any) {
  return render(<Component {...props} />);
}
