"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import MopIcon from "./MopIcon";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <div className="wf-navbar">
      <div className="wf-navbar-inner">
        <Link href="/" className="wf-logo">
          <span className="wf-logo-mark"><MopIcon size={17} /></span>
          Scholarly Sweeps
        </Link>
        <div className="wf-nav-links">
          <Link href="/">Home</Link>
          <Link href="/book">Book a clean</Link>
          <Link href="/dashboard">Product dashboard</Link>
        </div>
        <div className="wf-nav-right" ref={menuRef} style={{ position: "relative" }}>
          {loading ? null : user ? (
            <>
              <button
                className="wf-btn secondary pill"
                onClick={() => setMenuOpen((v) => !v)}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span className="wf-avatar" style={{ width: 24, height: 24, fontSize: 11 }}>
                  {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                {user.name.split(" ")[0]}
              </button>
              {menuOpen && (
                <div className="wf-menu">
                  <Link href="/account" onClick={() => setMenuOpen(false)}>My account</Link>
                  <button onClick={handleLogout}>Log out</button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="wf-btn secondary pill">Log in</Link>
              <Link href="/signup" className="wf-btn pill">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
