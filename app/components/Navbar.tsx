"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FlaskConical,
  Cpu,
  Database,
  PlusCircle,
  Bell,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/hardware", label: "Hardware", icon: Cpu },
  { href: "/datasets", label: "Datasets", icon: Database },
];

export default function Navbar({ visible = true }: { visible?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
    >
      {/* Logo */}
      <Link href="/" className="navbar-logo">
        <span className="logo-mark">N</span>
        <span className="logo-text">NEXUS</span>
      </Link>

      {/* Nav links */}
      <ul className="navbar-links">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link href={href} className={`nav-link ${active ? "nav-link--active" : ""}`}>
                <Icon size={14} />
                <span>{label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side */}
      <div className="navbar-right">
        <Link href="/log" className="btn-log-run">
          <PlusCircle size={14} />
          Log Run
        </Link>
        <button className="nav-icon-btn" aria-label="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>
        <button className="nav-avatar" aria-label="User menu">
          <span>SC</span>
          <ChevronDown size={12} />
        </button>
      </div>
    </motion.nav>
  );
}
