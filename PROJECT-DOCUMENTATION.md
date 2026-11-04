# PROJECT DOCUMENTATION

## Project 3 — EatHub Bites

### 1. Project Overview

- Project Name: EatHub Bites
- Project Category: Food Delivery Website
- Developed By: TechGlow Solutions
- Project Folder: D:\web-projects\eathub-bites\
- Initial Completion Date: 13 July 2026
- Latest Confirmed GitHub Commit: fe31a4f
- Frontend Hosting: GitHub Pages
- Backend Hosting: Render
- Version Control: Git and GitHub
- Backup: Google Drive — completed and confirmed by project owner
- Documentation Status: Prepared following final deployment

### 2. Important Project Links

**Live Website:**
https://techglowsolutionsindia.github.io/eathub-bites/

**GitHub Repository:**
https://github.com/techglowsolutionsindia/eathub-bites

**Backend API:**
https://eathub-bites-api.onrender.com

**Contact Form Endpoint:**
https://eathub-bites-api.onrender.com/api/contact

**GitHub Dashboard:**
https://github.com/

**Render Dashboard:**
https://dashboard.render.com/

Render Login Email:
websphereindia7@gmail.com

**Brevo Dashboard:**
https://app.brevo.com/

Brevo Login Email:
websphereindia7@gmail.com

### 3. Technologies Used

Frontend:

- HTML5
- CSS3
- Vanilla JavaScript
- JSON
- Font Awesome
- Swiper.js

Backend:

- Node.js
- Express.js
- CORS
- Brevo Transactional Email HTTPS API
- dotenv

Hosting and Deployment:

- GitHub Pages for frontend
- Render Web Service for backend
- GitHub for source control

### 4. Project File Structure

Project Root: D:\web-projects\eathub-bites\

Important files:

- index.html — Main website and contact form
- style.css — Main website styling
- script.js — Main website functionality and contact form integration
- auth.js — Authentication interface and related functionality
- auth.css — Authentication styling
- checkout.html — Checkout page
- checkout.js — Checkout functionality
- checkout.css — Checkout styling
- orders.html — Customer orders page
- orders.js — Orders functionality
- orders.css — Orders styling
- products.json — Product information
- sitemap.html — Human-readable sitemap
- sitemap.xml — Search engine sitemap
- robots.txt — Search engine crawler instructions
- .gitignore — Excluded local files and directories
- .gitattributes — Git file attribute configuration
- PROJECT-DOCUMENTATION.md — Project maintenance documentation

Important folders:

- images/ — Website images and visual assets
- images/logo/ — Branded SVG logo
- backend/ — Backend application

Backend files:

- backend/server.js — Express server and contact email API
- backend/package.json — Backend dependencies and scripts
- backend/package-lock.json — Dependency lock file
- backend/.env — Local environment configuration; never commit
- backend/node_modules/ — Installed backend dependencies; never commit

### 5. Logo Configuration

Official branded logo:

images/logo/food-delivery-logo.svg

Used for:

- Website favicon
- Navbar logo
- Footer logo
- Authentication popup
- Checkout page logo
- Orders page logo

The previous file images/food-delivery-logo.webp was deleted after updating its known references.

Navbar and footer logo sizing is controlled separately through CSS.

### 6. Frontend Hosting Configuration

Provider: GitHub Pages

Repository:
techglowsolutionsindia/eathub-bites

Branch:
main

Website URL:
https://techglowsolutionsindia.github.io/eathub-bites/

The website uses static HTML, CSS, JavaScript and image assets.

The contact form communicates with the separately hosted Render backend.

### 7. Backend Hosting Configuration

Provider: Render

Service Name:
eathub-bites-api

Service Type:
Web Service

Plan:
Free

Region:
Singapore

Repository:
techglowsolutionsindia/eathub-bites

Branch:
main

Root Directory:
backend

Build Command:
npm install

Start Command:
node server.js

Backend URL:
https://eathub-bites-api.onrender.com

Render Service ID:
srv-dbkm4q6k1f9s73dcgung

Previously confirmed deployment:
Commit e2d7068 — Live

Render automatically deploys new commits when automatic deployment is enabled.

Important: Free instances may sleep during inactivity, resulting in slower first requests.

### 8. Backend API Configuration

Main API Endpoint:

POST /api/contact

Full URL:
https://eathub-bites-api.onrender.com/api/contact

Purpose:
Accept contact form enquiries from the website and send email notifications.

Server Configuration:

- Express application
- CORS origin restrictions
- Form validation
- Honeypot spam protection
- Email delivery integration

Allowed frontend origins configured in the backend:

- http://127.0.0.1:5500
- http://localhost:5500
- https://techglowsolutionsindia.github.io

Backend health route:

GET /

Expected response:
EatHub contact server is running.

### 9. Contact Form Integration

Frontend Configuration:

File:
index.html

Global API variable:
window.EATHUB_CONTACT_API_URL

Configured Endpoint:
https://eathub-bites-api.onrender.com/api/contact

JavaScript Handler:

File:
script.js

The contact form submits its data to the configured backend API.

Backend Handler:

File:
backend/server.js

The backend validates submissions and attempts to send an email notification through the configured email provider.

Live email delivery status:
Not yet verified in the available project records.

### 10. Brevo Email Integration

Provider:
Brevo

Integration:
Brevo Transactional Email HTTPS API

API Endpoint:
https://api.brevo.com/v3/smtp/email

Request Method:
POST

Backend File:
backend/server.js

Purpose:

- Send contact enquiry notifications to the website owner.
- Send confirmation emails to customers.

Environment Variable Names:

- BREVO_API_KEY
- BREVO_SENDER_EMAIL
- OWNER_EMAIL
- NODE_ENV
- PORT (optional; Render can provide this automatically)

The backend uses HTTPS requests to Brevo's transactional email API.

SMTP credentials and Nodemailer are not required for this integration.

Secrets must be maintained in:

- Render Environment settings
- Local backend/.env

Never include API keys, passwords, or other secret values in this document.

### 11. Environment File Security

File:
backend/.env

This file contains local backend configuration and must not be uploaded to GitHub.

The root .gitignore includes:

/backend/.env
/backend/node_modules/

Git ignore behavior was previously verified.

Do not commit:

- Environment files
- API secrets
- SMTP credentials
- Passwords
- Private customer information

### 12. Authentication, Checkout and Orders

Authentication Interface:
auth.js and auth.css

Checkout:
checkout.html, checkout.js and checkout.css

Orders:
orders.html, orders.js and orders.css

The website includes sign-in/sign-up functionality, a shopping cart, checkout interface, and an order history interface.

The precise persistence, payment-processing and authentication security guarantees have not been independently verified.

Do not describe the checkout as a production payment gateway unless an actual payment provider integration is confirmed.

### 13. Search Engine Configuration

Main website:
index.html

Search engine sitemap:
sitemap.xml

Human-readable sitemap:
sitemap.html

Crawler configuration:
robots.txt

The main website is intended to be indexable.

Checkout and orders pages are configured to discourage search indexing.

The sitemap identifies the public website page.

### 14. Updating the Frontend

Open VS Code in:

D:\web-projects\eathub-bites\

After completing necessary changes and saving the files, use the terminal:

```powershell
git status --short
git diff --check
git add -A
git diff --cached --check
git commit -m "Describe the completed changes"
git push origin main
```

GitHub Pages publishes changes from the configured deployment source.

Allow time for deployment before checking newly published changes.

Do not use force push for routine updates.

### 15. Updating the Backend

Backend source:

D:\web-projects\eathub-bites\backend\server.js

The Render service uses the same GitHub repository with the backend root directory.

For backend changes:

1. Update the relevant backend file.
2. Save and review the changes.
3. Commit and push to the main branch.
4. Check the Render deployment status.
5. Inspect Render logs if a deployment or API request fails.

Never include environment secrets in Git commits.

### 16. Essential Functional Checks

Perform only when the relevant functionality changes or a specific problem is reported.

Frontend:

- Website loads successfully
- Important images and links work
- Navigation works
- Authentication interface opens
- Cart and checkout functionality work
- Orders interface loads

Backend:

- Render service is running
- Contact API responds
- CORS permits the live website
- Email notifications are delivered

Do not repeat full website audits when no related code has changed.

### 17. Deployment and Maintenance History

13 July 2026:
EatHub Bites recorded as a completed TechGlow Solutions portfolio website.

2 November 2026:

- Render backend deployed successfully.
- Frontend connected to the Render contact API.
- GitHub Pages origin added to backend CORS configuration.
- SVG logo references updated across the website.
- Previous WebP logo removed.
- robots.txt created.
- sitemap.html created.
- sitemap.xml created.
- Final logo and sitemap changes committed as fe31a4f.
- GitHub push to main completed successfully.
- Live homepage and orders page visually checked.
- Google Drive backup completed by project owner.

### 18. Known Limitations and Unverified Items

- Live contact email delivery: Not yet verified.
- Production-grade authentication and data persistence: Not independently verified.
- Real payment gateway integration: Not verified.
- Backend deployment following the final frontend-only commit: Not separately checked; no backend file changes were included in that commit.

These items should be revisited only when necessary for the website's intended functionality or when a related issue is reported.

### 19. Future Maintenance Rules

- Make only necessary, verified fixes.
- Work one file at a time.
- Group necessary changes within the same file.
- Use exact Find and Replace instructions.
- Preserve existing working functionality.
- Check file dependencies before deletion.
- Obtain approval before removing project assets.
- Keep GitHub and Google Drive backups current.
- Update this documentation after important technical changes.
- Never store secrets or customer information in documentation.

### 20. Project Handover

Frontend deployment: Completed

Backend hosting deployment: Completed

Branded SVG logo migration: Completed

Sitemap and robots configuration: Completed

GitHub repository update: Completed

Google Drive backup: Completed

Project documentation: Prepared; save to the project root and include in the next GitHub/Google Drive update.

Outstanding verification:
Live contact email delivery, if required for production use.

---

Document: PROJECT-DOCUMENTATION.md

Project: EatHub Bites

Maintained By: TechGlow Solutions
