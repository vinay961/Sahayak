import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image"; // Correct import

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/sahayak_logo.png" 
            alt="Sahayak Logo"
            width={50} 
            height={50}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-blue-800">Sahayak</h1>
        </div>

        <nav className="hidden md:flex space-x-6 text-gray-700">
          <Link href="/" className="hover:text-blue-500 font-medium">Home</Link>
          <Link href="/schemes" className="hover:text-blue-500 font-medium">Schemes</Link>
          <Link href="/news" className="hover:text-blue-500 font-medium">News</Link>
          <Link href="/about" className="hover:text-blue-500 font-medium">About</Link>
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="text-gray-700 hover:text-blue-500 font-medium" onClick={toggleMenu}>Home</Link>
          <Link href="/schemes" className="text-gray-700 hover:text-blue-500 font-medium" onClick={toggleMenu}>Schemes</Link>
          <Link href="/news" className="text-gray-700 hover:text-blue-500 font-medium" onClick={toggleMenu}>News</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500 font-medium" onClick={toggleMenu}>About</Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
