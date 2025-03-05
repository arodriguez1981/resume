import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="w-[97%] mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              About Us
            </h3>
            <p className="mt-4 text-base text-gray-500">
              <span className="text-blue-600">Workinfi</span> Resume helps you create professional resumes and cover letters in minutes. Our AI-powered tools make it easy to stand out from the crowd.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:support@workinfo_resume.com" className="text-base text-gray-500 hover:text-gray-900">
                  support@workinfo_resume.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a href="tel:2393751111" className="text-base text-gray-500 hover:text-gray-900">
                  (239) 375-1111
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Contact
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; 2024 <span className="text-blue-600">Workinfi</span> Resume. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;