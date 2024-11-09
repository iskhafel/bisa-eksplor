import { Footer } from "flowbite-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const CustomFooter = () => {
  return (
    <Footer container className="bg-slate-800 text-gray-200 rounded-none">
      <div className="w-full flex justify-between items-center py-4 rounded-none">
        {/* Copyright Section */}
        <Footer.Copyright
          href="#"
          by="BisaEksplor"
          year={2024}
          className="text-gray-400"
        />

        {/* Social Media Links */}
        <Footer.LinkGroup className="flex gap-6">
          <a
            href="#"
            aria-label="Facebook"
            className="text-2xl text-gray-300 hover:text-blue-400 transition-colors duration-200"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-2xl text-gray-300 hover:text-pink-400 transition-colors duration-200"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="text-2xl text-gray-300 hover:text-gray-500 transition-colors duration-200"
          >
            <FaTiktok />
          </a>
        </Footer.LinkGroup>
      </div>
    </Footer>
  );
};

export default CustomFooter;
