import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import ejs from "ejs";

// Define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// http://localhost:3000/api/templates/blog/getTemplates
router.get("/getTemplates", protectRoute, (req, res) => {
  const viewsPath = path.join(__dirname, "../views");
  const templates = [];

  try {
    fs.readdirSync(viewsPath).forEach((file) => {
      if (file.endsWith(".ejs")) {
        const templateName = file.split(".")[0];
        const templateContent = fs.readFileSync(
          path.join(viewsPath, file),
          "utf-8"
        );

        const sampleData = {
          title: "Sample Title",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit cum incidunt in ratione commodi temporibus unde dolor, odio corporis amet minima obcaecati iure exercitationem nesciunt ex explicabo impedit.",
          tags: ["sample", "blog", "template"],
        };

        // render the html
        const renderedHtml = ejs.render(templateContent, sampleData);

        templates.push({
          name: templateName,
          content: renderedHtml,
        });
      }
    });

    res.json({
      success: true,
      message: "Templates fetched successfully",
      templates: templates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
});

export default router;
