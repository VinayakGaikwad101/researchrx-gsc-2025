import { useState } from "react";
import { useSelfDiagnosis } from "../store/useSelfDiagnosis";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Label } from "./ui/label";

const SelfDiagnosis = () => {
  const [userInput, setUserInput] = useState("");
  const { selfDiagnose, isLoading, error, disease } = useSelfDiagnosis();

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const symptomsArray = userInput
      .split(/[\n, ]+/)
      .map((symptom) => symptom.trim().toLowerCase().replace(/\s+/g, "_"))
      .filter(Boolean);

    if (symptomsArray.length === 0) {
      return;
    }

    selfDiagnose(symptomsArray);
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

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold">
                Self Diagnosis
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your symptoms for a preliminary diagnosis
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Your Symptoms</Label>
                  <Input
                    id="symptoms"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Enter symptoms separated by commas (e.g., headache, fever, cough)"
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Describe your symptoms in simple terms. The system will match them to the closest recognized symptoms.
                  </p>
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="relative"
                >
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !userInput.trim()}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                        <span>Analyzing Symptoms...</span>
                      </motion.div>
                    ) : (
                      "Get Diagnosis"
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {error && (
                <motion.div variants={resultVariants}>
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {disease && (
                <motion.div variants={resultVariants}>
                  <Alert className="mt-4">
                    <AlertTitle className="text-lg font-semibold">
                      Preliminary Diagnosis
                    </AlertTitle>
                    <AlertDescription className="mt-2 space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-lg">
                          Based on your symptoms, you may have:
                        </p>
                        <p className="text-xl font-bold text-primary mt-2">
                          {disease}
                        </p>
                      </div>
                      
                      <div className="text-sm space-y-2 border-l-4 border-primary pl-4">
                        <p className="font-medium">Important Notice:</p>
                        <p className="text-muted-foreground">
                          This is a preliminary diagnosis only and should not replace 
                          professional medical advice.
                        </p>
                        <p className="text-muted-foreground">
                          Please consult with a healthcare provider for proper 
                          evaluation and treatment.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SelfDiagnosis;
