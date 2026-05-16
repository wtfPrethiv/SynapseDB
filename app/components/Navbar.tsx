"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const demoSuffix = isDemo ? "?demo=true" : "";

  /* ---------- find the active link's index for the CSS-driven indicator ---------- */
  const activeIndex = navLinks.findIndex(
    (link) => pathname === link.href || pathname.startsWith(link.href + "/")
  );

  return (
    <nav
      className={`navbar navbar-enter ${scrolled ? "navbar--scrolled" : ""}`}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      {/* Logo */}
      <Link href="/" className="navbar-logo">
        <span className="logo-text">SynapseDB</span>
      </Link>

      {/* Nav links */}
      <ul className="navbar-links">
        {navLinks.map((link, i) => {
          const isActive = i === activeIndex;
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={`${link.href}${demoSuffix}`}
                className={`nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                {isActive && <span className="nav-indicator" />}
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
    </nav>
  );
}
