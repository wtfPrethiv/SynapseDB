"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FlaskConical,
  Cpu,
  Database,
  PlusCircle,
  Bell,
  LogIn,
  LogOut,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Experiments", href: "/experiments", icon: FlaskConical },
  { label: "Hardware", href: "/hardware", icon: Cpu },
  { label: "Datasets", href: "/datasets", icon: Database },
];

export default function Navbar({ visible = true }: { visible?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const isDemo = !session || searchParams.get("demo") === "true";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const demoSuffix = isDemo ? "?demo=true" : "";

  return (
    <motion.nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
    >
      {/* Logo — text only, no mark */}
      <Link href="/" className="navbar-logo">
        <span className="logo-text">SynapseDB</span>
      </Link>

      {/* Nav links */}
      <ul className="navbar-links">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={`${link.href}${demoSuffix}`}
                className={`nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                {isActive && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={14} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side */}
      <div className="navbar-right">
        {session ? (
          <>
            <Link href="/log" className="btn-log-run">
              <PlusCircle size={14} />
              Log Run
            </Link>
            <button className="nav-icon-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="notif-dot" />
            </button>
            <button
              className="nav-avatar"
              aria-label="User menu"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign out"
            >
              <span>{session.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}</span>
              <LogOut size={12} />
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="btn-log-run">
            <LogIn size={14} />
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
