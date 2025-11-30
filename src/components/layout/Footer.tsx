import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 RentFAX. All rights reserved.</p>
          <ul className="flex space-x-4">
            <li>
              <Link href="/terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/enterprise" className="hover:text-gray-300">
                White-Label Solutions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
