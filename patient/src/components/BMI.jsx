import { useState } from "react";
import { useBMIStore } from "../store/useBMIStore";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const BMI = () => {
  const { BMI, isLoading, fetchBMI } = useBMIStore();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");

  const handleFetchBMI = async () => {
    const convertedHeight = unit === "imperial" ? height * 2.54 : height;
    const convertedWeight = unit === "imperial" ? weight * 0.453592 : weight;
    await fetchBMI({
      height: convertedHeight,
      weight: convertedWeight,
      unit,
    });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  const getProgressValue = (bmi) => {
    if (!bmi) return 0;
    return Math.min(Math.max((bmi / 40) * 100, 0), 100);
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
        className="max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card>
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center">
                BMI Calculator
              </CardTitle>
              <CardDescription className="text-center mt-2">
                Calculate your Body Mass Index
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div variants={itemVariants}>
              <Label htmlFor="unit">Unit System</Label>
              <Select
                value={unit}
                onValueChange={setUnit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="height">
                {unit === "metric" ? "Height (cm)" : "Height (inches)"}
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="weight">
                {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                className="w-full"
                onClick={handleFetchBMI}
                disabled={!height || !weight || !unit || isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    <span>Calculating...</span>
                  </motion.div>
                ) : (
                  "Calculate BMI"
                )}
              </Button>
            </motion.div>

            {BMI > 0 && (
              <motion.div
                variants={resultVariants}
                className="space-y-4 pt-4"
              >
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold">
                    {BMI.toFixed(1)}
                  </p>
                  <p className={`text-lg font-medium ${getBMICategory(BMI).color}`}>
                    {getBMICategory(BMI).category}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <Progress value={getProgressValue(BMI)} className="h-2" />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  BMI is a measure of body fat based on height and weight. 
                  A healthy BMI range is between 18.5 and 24.9.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BMI;
