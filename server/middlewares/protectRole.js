// middlewares/authMiddleware.js
const protectRoleSpecificRoute = (req, res, next) => {
  if (req.user && req.user.role === "Researcher") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Researchers only.", success: false });
  }
};

export default protectRoleSpecificRoute;
