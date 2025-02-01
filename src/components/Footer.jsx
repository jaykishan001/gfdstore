"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">MYOWNSTORE</h2>
            <p className="mb-4">
              We are dedicated to providing the best products and services to
              our customers.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-400">
                <Facebook size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Twitter size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Linkedin size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-blue-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={20} className="mr-2" />
                <Link
                  href="mailto:info@example.com"
                  className="hover:text-blue-400"
                >
                  info@example.com
                </Link>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2" />
                <Link href="tel:+1234567890" className="hover:text-blue-400">
                  +1 (234) 567-890
                </Link>
              </li>
              <li className="flex items-center">
                <MapPin size={20} className="mr-2" />
                <span>123 Street Name, City, Country</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Newsletter</h2>
            <p className="mb-4">
              Stay updated with our latest news and offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col space-y-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white border-gray-700"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
