import { useNavigate } from "react-router-dom";
import logoComponent from "../assets/logoComponent.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
    >
      <Card className="max-w-3xl w-full overflow-hidden">
        <div className="md:flex">
          <motion.div 
            className="md:flex-shrink-0"
            variants={imageVariants}
          >
            <img
              className="h-full w-full object-contain rounded-l-lg"
              src={logoComponent}
              alt="ResearchRX Logo"
            />
          </motion.div>
          <div className="flex-1">
            <CardHeader>
              <motion.div 
                className="text-sm font-semibold text-primary uppercase tracking-wide"
                variants={itemVariants}
              >
                ResearchRX
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardTitle className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                  Welcome to ResearchRX
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="mt-4 text-xl">
                  Your trusted platform for medical research and diagnosis. Join us to explore
                  cutting-edge healthcare solutions and personalized medical insights.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="lg"
                  className="mt-4 relative overflow-hidden group"
                  onClick={handleGetStarted}
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-10 transition-opacity"
                    initial={false}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.5 }}
                  />
                </Button>
              </motion.div>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Home;
