import { ModalProvider } from "@/contexts/ModalContext";
import ModalRoot from "@/components/ModalRoot";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ModalProvider>
          {children}
          <ModalRoot />
        </ModalProvider>
      </body>
    </html>
  );
}
