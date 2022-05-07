/*****************************************************************
 * File: server.js
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

const app = express();
const path = require("path");
const express = require("express");
const serveStatic = require("serve-static");

app.use(serveStatic(path.join(__dirname, "dist")));

// Set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
