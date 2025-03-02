import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, ArrowRight } from "lucide-react";

const VerifyEmail = () => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, loading } = useAuthStore();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationData = { code: otp.join("") };
    await verifyOTP(verificationData, navigate);
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    const resendData = { email };
    await resendOTP(resendData);
    setShowEmailInput(false);
    // Reset OTP fields
    setOTP(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6).split("");
      const newOTP = [...otp];
      pastedValue.forEach((char, i) => {
        if (index + i < 6) {
          newOTP[index + i] = char;
        }
      });
      setOTP(newOTP);
      const nextIndex = Math.min(index + pastedValue.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
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
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Enter the 6-digit code sent to your email
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      onFocus={() => setActiveInput(index)}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Verify Email <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <Button
                variant="ghost"
                onClick={() => setShowEmailInput(true)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Didn't receive code? Resend OTP
              </Button>
            </motion.div>

            {showEmailInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <form onSubmit={handleResendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Resend OTP
                  </Button>
                </form>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
