import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Leaf, Award, Map, User, LogOut, Sun, Moon, Brain } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import "./index.css";

const getNavLinks = (userRole) => {
  const baseLinks = [
    { href: "/heatmap", label: "Heatmap", icon: Map },
    { href: "/binmap", label: "Bins", icon: Map }
  ];

  if (userRole === "worker") {
    return [
      ...baseLinks,
      { href: "/worker/routes", label: "My Routes", icon: Map },
    ];
  }

  if (["admin", "superadmin"].includes(userRole)) {
    return [
      ...baseLinks,
      { href: "/admin/truck-map", label: "Truck Routes", icon: Map },
      { href: "/leaderboard", label: "Leaderboard", icon: Award },
    ];
  }

  return [
    ...baseLinks,
    { href: "/report", label: "Scan E-Waste", icon: Leaf },
    { href: "/education", label: "Learn", icon: Brain },
    { href: "/rewards", label: "Rewards", icon: Award },
    { href: "/leaderboard", label: "Leaderboard", icon: Award },
    { href: "/profile", label: "Profile", icon: User },
  ];
};

const NavbarItem = ({ href, label, icon: Icon, onClick }) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/30"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`
    }
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = getNavLinks(userRole);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled || mobileOpen
          ? "backdrop-blur-md border-b shadow-lg"
          : "bg-transparent border-transparent"
      }`}
      style={scrolled || mobileOpen ? {
        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all">
              <Leaf className="text-white fill-white" size={24} />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight group-hover:to-white transition-all">
              RapidResponse
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthPage && (
              <>
                {navLinks.map((link) => (
                  <NavbarItem key={link.href} {...link} />
                ))}
                <div className="h-6 w-px bg-white/10 mx-2" />
              </>
            )}

            {isLoggedIn && !isAuthPage ? (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <NavLink
                  to={
                    userRole === "worker" 
                      ? "/worker/dashboard" 
                      : ["admin", "superadmin"].includes(userRole) 
                        ? "/admin/dashboard" 
                        : "/user/dashboard"
                  }
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all text-sm"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <NavLink
                  to="/login"
                  className={`text-gray-300 hover:text-white px-4 py-2 font-medium transition-colors ${
                    location.pathname === "/login" ? "text-emerald-400 font-bold" : ""
                  }`}
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className={`px-5 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all text-sm ${
                    location.pathname === "/register" 
                    ? "bg-emerald-500 text-white shadow-emerald-500/25" 
                    : "bg-white text-emerald-900 shadow-white/25"
                  }`}
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Hidden on Auth Pages */}
          {!isAuthPage && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 border-b shadow-2xl transition-all duration-300 origin-top max-h-[calc(100vh-5rem)] overflow-y-auto ${
          mobileOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavbarItem 
              key={link.href} 
              {...link} 
              onClick={() => setMobileOpen(false)} 
            />
          ))}
          
          <div className="h-px bg-white/10 my-4" />
          
          {isLoggedIn ? (
            <div className="space-y-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 font-bold"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <NavLink
                to={
                  userRole === "worker" 
                    ? "/worker/dashboard" 
                    : ["admin", "superadmin"].includes(userRole) 
                      ? "/admin/dashboard" 
                      : "/user/dashboard"
                }
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Go to Dashboard
              </NavLink>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 font-bold"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="col-span-1 text-center py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="col-span-1 text-center py-3 rounded-xl bg-white text-emerald-900 font-bold"
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
