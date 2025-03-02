import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout, checkingAuth } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
      setIsOpen(false);
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -16 },
    open: { opacity: 1, x: 0 },
  };

  const NavLink = ({ to, children, className = "", onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`${
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        } px-3 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-16 bg-black border-b border-white/10">
        <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = authUser
    ? [
        { to: "/profile", label: "Profile" },
        { to: "/medical-reports", label: "Reports" },
        { to: "/bmi", label: "BMI" },
        { to: "/self-diagnose", label: "Diagnose" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {authUser ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                Logout
              </Button>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden bg-black/95 backdrop-blur"
            >
              <div className="space-y-1 pb-3">
                {menuItems.map((item) => (
                  <motion.div key={item.to} variants={menuItemVariants}>
                    <NavLink
                      to={item.to}
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                {authUser ? (
                  <motion.div variants={menuItemVariants}>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Logout
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <NavLink
                        to="/login"
                        className="block"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </NavLink>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <NavLink
                        to="/signup"
                        className="block"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
