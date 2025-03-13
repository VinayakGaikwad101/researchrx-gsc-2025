import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    dob: "",
    gender: "",
    specialization: "", // New field for specialization
    committee: "", // New field for committee
  });

  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (value) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupData = {
      ...formData,
      role: "Researcher",
    };
    await signup(signupData, navigate);
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
        <Card className="w-full">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-center">
                Create Account
              </CardTitle>
              <CardDescription className="text-center mt-2">
                Enter your details to create your account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  type="tel"
                  id="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  type="date"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  type="text"
                  id="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="committee">Committee</Label>
                <Select
                  value={formData.committee}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, committee: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Committee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ethics">Ethics</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Clinical">Clinical</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </motion.div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </motion.div>

              <motion.div 
                className="text-center mt-4"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Already have an account?
                  </Link>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
