import { sendContactFormResponse } from "../utils/emailer.utils.js";

export const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required",
        success: false,
      });
    }

    await sendContactFormResponse(name, email, message);
    return res.status(200).json({
      message: "Contact form submitted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in patient contact form controller: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
