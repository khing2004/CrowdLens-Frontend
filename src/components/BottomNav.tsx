import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const { pathname } = useLocation();

  const links = [
    {
      to: "/home",
      label: "Home",
      icon: "/Home.png",
      iconActive: "/Home Selected.png",
    },
    {
      to: "/favorites",
      label: "Favorites",
      icon: "/Favorites.png",
      iconActive: "/Favorites Selected.png",
    },
    {
      to: "/settings",
      label: "Account",
      icon: "/Settings.png",
      iconActive: "/Settings Selected.png",
    },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {links.map(({ to, label, icon, iconActive }) => {
        const active = pathname === to;
        return (
          <div className="nav-section" key={to}>
            <Link to={to} className="nav-item" aria-current={active ? "page" : undefined}>
              <img
                src={active ? iconActive : icon}
                alt={label}
                className="nav-icon"
              />
              <p className={`nav-text${active ? " nav-text-active" : ""}`}>{label}</p>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
