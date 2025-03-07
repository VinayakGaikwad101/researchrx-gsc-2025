import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, logout, checkingAuth } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  return (
    <nav className="bg-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0"></Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {authUser ? (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/medical-reports"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/create-blog"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/periodic-table"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Periodic Table
                  </Link>
                    <Link
                      to="/research"
                      className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Research
                    </Link>
                    <Link
                      to="/chat"
                      className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Chat
                    </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-white hover:bg-teal-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-teal-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {authUser ? (
                <>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/profile"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/medical-reports"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Reports
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/create-blog"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Blogs
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/periodic-table"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Periodic Table
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/research"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Research
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/chat"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Chat
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <button
                      onClick={handleLogout}
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Home
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/login"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/signup"
                      className="text-white hover:bg-teal-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
