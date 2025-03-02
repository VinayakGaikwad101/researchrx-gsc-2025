import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Home } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const navigateTimeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const countdownVariants = {
    initial: { scale: 1.2, opacity: 1 },
    animate: { scale: 1, opacity: 0.3 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
              variants={numberVariants}
            >
              404
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl mt-4">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Oops! The page you are looking for doesn't exist.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <p className="text-muted-foreground">
                You will be redirected to the home page in
              </p>
              <motion.div
                key={countdown}
                initial="initial"
                animate="animate"
                variants={countdownVariants}
                className="text-4xl font-bold text-primary"
              >
                {countdown}
              </motion.div>
              <p className="text-muted-foreground">
                seconds
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex justify-center"
            >
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
