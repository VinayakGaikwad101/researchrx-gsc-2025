import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, lastRequestTime, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 60000) {
      toast.error("Please wait 60 seconds before sending another request");
      return;
    }

    await forgotPassword(email);
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

  const getTimeLeft = () => {
    const timePassed = Date.now() - lastRequestTime;
    const timeLeft = Math.ceil((60000 - timePassed) / 1000);
    return timeLeft > 0 ? timeLeft : 0;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  // Update countdown every second
  useState(() => {
    if (lastRequestTime) {
      const interval = setInterval(() => {
        const newTimeLeft = getTimeLeft();
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastRequestTime]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card>
          <CardHeader className="space-y-2">
            <motion.div variants={itemVariants} className="text-center">
              <CardTitle className="text-3xl font-bold">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              {timeLeft > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center"
                >
                  <Alert>
                    <AlertDescription>
                      Please wait {timeLeft} seconds before requesting another reset link
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || timeLeft > 0}
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      <span>Sending Link...</span>
                    </motion.div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </motion.div>

              <motion.p 
                variants={itemVariants}
                className="text-sm text-center text-muted-foreground mt-4"
              >
                Remember your password?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Back to login
                </a>
              </motion.p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
