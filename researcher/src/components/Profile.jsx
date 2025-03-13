import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

const Profile = () => {
  const { authUser } = useAuthStore();

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

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl text-muted-foreground font-semibold">
            No user data available.
          </p>
        </motion.div>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const ProfileItem = ({ label, value }) => (
    <motion.div
      variants={itemVariants}
      className="flex flex-col space-y-1"
    >
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold">{value}</dd>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card>
          <CardHeader className="space-y-6">
            <motion.div
              className="flex items-center justify-center"
              variants={itemVariants}
            >
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">
                  {getInitials(authUser.firstName, authUser.lastName)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.div 
              className="text-center space-y-2"
              variants={itemVariants}
            >
              <CardTitle className="text-2xl font-bold">
                {authUser.firstName} {authUser.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {authUser.role}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={itemVariants}
              className="w-full"
            >
              <Separator className="my-6" />
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              <ProfileItem 
                label="Email"
                value={authUser.email}
              />
              <ProfileItem 
                label="Phone"
                value={authUser.phoneNo || "Not provided"}
              />
              <ProfileItem 
                label="Date of Birth"
                value={authUser.dob ? new Date(authUser.dob).toLocaleDateString() : "Not provided"}
              />
              <ProfileItem 
                label="Gender"
                value={authUser.gender || "Not provided"}
              />
              <ProfileItem 
                label="Specialization"
                value={authUser.specialization || "Not provided"}
              />
              <ProfileItem 
                label="Committee"
                value={authUser.committee || "Not provided"}
              />
              <ProfileItem 
                label="Account Status"
                value={authUser.isVerified ? "Verified" : "Pending Verification"}
              />
              <ProfileItem 
                label="Member Since"
                value={authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "Not available"}
              />
            </div>

            <motion.div
              variants={itemVariants}
              className="w-full"
            >
              <Separator className="my-6" />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground"
            >
              <p>
                This information is private and only visible to you.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
