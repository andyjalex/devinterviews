"use client";

import Link from "next/link";
import { useState } from "react";


const navItems = [
  { id: 1, href: "/events", label: "About" },
  { id: 2, href: "/events", label: "Events" },
];
export default function MainHeader() {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header id="main-header">
      <div id="logo">
        <Link href="/">
          <h1>DEV INTERVIEWS</h1>
        </Link>

         
      </div>
      <button
          className="menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setIsMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <div
        className={`mobile-nav-overlay ${isMenuOpen ? "is-open" : ""}`}
        onClick={closeMenu}
      />
      <aside
        id="mobile-nav-panel"
        className={`mobile-nav-panel ${isMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          className="menu-close"
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
        >
          x
        </button>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </header>
  );
};

