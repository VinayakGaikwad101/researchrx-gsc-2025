import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }, navigate);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center mt-2">
                Enter your credentials to access your account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  variant="default"
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </motion.div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 space-y-2">
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary">
                    Don't have an account?
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot your password?
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Link to="/otp-verification" className="text-sm text-muted-foreground hover:text-primary">
                    Email not verified?
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
