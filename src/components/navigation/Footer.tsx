import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";

interface FooterLink {
  name: string;
  href: string;
  special?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  product: [
    { name: "Pricing", href: "/pricing" },
    { name: "Features", href: "/features" },
    { name: "Changelog", href: "/changelog" },
    { name: "Sign In", href: "/login" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold">RentFax</h3>
            <p className="text-gray-400 mt-2 text-sm">
              AI-powered renter screening for modern landlords.
            </p>
            <div className="mt-4">
              <ChatWidget />
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold capitalize">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <a className="text-gray-400 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RentFax, Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {/* Social links can be added here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
