import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const AboutUs = () => {
  const navigate = useNavigate();

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

  const features = [
    {
      title: "Patient-Centric Care",
      description: "We put our patients first, ensuring personalized care and attention to individual needs."
    },
    {
      title: "Advanced Technology",
      description: "Leveraging cutting-edge technology to provide accurate diagnoses and effective treatments."
    },
    {
      title: "Research Excellence",
      description: "Continuous research and development to stay at the forefront of medical innovations."
    },
    {
      title: "Accessibility",
      description: "Making healthcare accessible through our digital platform and comprehensive services."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full">
          <CardHeader className="text-center space-y-4">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-4xl font-bold">
                About ResearchRX
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Transforming Healthcare Through Innovation
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mission Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At ResearchRX, we are committed to revolutionizing healthcare delivery
                through innovative technology and patient-centered approaches. Our mission
                is to make quality healthcare accessible, efficient, and personalized for
                everyone.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Separator className="my-8" />
            </motion.div>

            {/* Features Grid */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold">What Sets Us Apart</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6 rounded-lg bg-muted/50"
                  >
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Separator className="my-8" />
            </motion.div>

            {/* Vision Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a future where advanced healthcare is seamlessly integrated
                with everyday life, where preventive care is prioritized, and where
                every individual has access to the best medical expertise through
                technology.
              </p>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mt-8"
            >
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="text-lg"
              >
                Get in Touch
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AboutUs;
