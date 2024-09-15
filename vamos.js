const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to render the homepage
app.get("/", function (req, res) {
    fs.readdir(path.join(__dirname, "files"), function (err, files) {
        if (err) {
            console.log("Error reading files:", err);
            return res.status(500).send("Error reading files");
        }
        // Pass the list of files to the EJS template
        res.render("index", { files: files });
    });
});

// POST route to handle form submission
app.post("/create", function (req, res) {
    const title = req.body.title.split(" ").join(""); // Remove spaces from title
    const filePath = path.join(__dirname, "files", `${title}.txt`);
    const details = req.body.details;

    // Check if 'files' directory exists, and create it if not
    if (!fs.existsSync(path.join(__dirname, "files"))) {
        fs.mkdirSync(path.join(__dirname, "files"));
    }

    // Write the file
    fs.writeFile(filePath, details, function (err) {
        if (err) {
            console.log("Error writing file:", err);
            return res.status(500).send("Error writing file");
        }
        res.redirect("/"); // Redirect after creating the file
    });
});

app.listen(4000, function () {
    console.log("Server is running on port 4000");
});
