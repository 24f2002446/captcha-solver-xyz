# Captcha Solver Demo

A lightweight browser-based captcha solver demo. It loads a captcha image from the URL query parameter ?url= and solves it using OCR. If no URL is provided or the load fails, a generated sample captcha is used as a fallback.

## FEATURES
- OCR-based captcha solving in the browser (uses Tesseract.js)
- Accepts captcha image via ?url= parameter
- Robust fallback to a generated sample when external URLs are unavailable
- Solves and displays the answer within 15 seconds
- MIT License
- No server-side dependencies; works entirely in the client

## DOCUMENTATION
- The page loads an image from the provided URL. If the URL is missing or fails to load, a mock captcha image is generated on the fly.
- OCR is performed in the browser using Tesseract.js with a whitelist limiting characters to A-Z and 0-9.
- A 15-second timeout enforces the requirement to provide a quick answer. If timed out, the page shows a timeout message.
- All assets live in the project root: index.html, styles.css, script.js, README.md, LICENSE.

## HOW TO USE
1. Open the repository on GitHub Pages or locally by opening index.html.
2. Pass a captcha image URL via the query parameter ?url. Example:
   https://your-username.github.io/your-repo/?url=https://example.com/captcha.png
3. The page will display the captcha image and attempt to solve it within 15 seconds.
4. If no URL is provided or the image cannot be loaded, a generated sample captcha is used and solved automatically.

## PROJECT STRUCTURE
- index.html: The main HTML entry point loaded by GitHub Pages.
- styles.css: Styling for layout and UI.
- script.js: Core logic to load, display, and solve the captcha using OCR.
- README.md: This file.
- LICENSE: MIT license text.
