# IEDC ASIET Executive Committee Application Form

A modern, responsive Google Form clone built with Next.js for collecting executive committee applications with automatic Google Sheets and Google Drive integration.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Position-Specific Fields**: Dynamic form fields based on selected position
- **File Upload**: Design Lead applicants can upload project files
- **Google Integration**: Automatic data storage in Google Sheets and file uploads to Google Drive
- **Real-time Validation**: Client-side form validation with helpful error messages
- **WhatsApp Integration**: Automatic redirect to WhatsApp group after submission
- **Background Customization**: Upload custom background images

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed on your computer
- A Google account
- Basic knowledge of environment variables

## 🛠️ Installation & Setup

### Step 1: Clone and Install

\`\`\`bash
# Clone the repository (or download the code)
git clone <your-repo-url>
cd iedc-execom-form

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Step 2: Google Sheets Setup

1. **Create Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "IEDC Execom Applications"
   - Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### Step 3: Google Apps Script Setup

1. **Create Apps Script Project**:
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Delete the default code

2. **Add the Script Code**:
   - Copy the entire code from `scripts/google-apps-script.js`
   - Paste it into the Apps Script editor
   - Replace `YOUR_SPREADSHEET_ID` with your actual Google Sheet ID

3. **Deploy as Web App**:
   - Click "Deploy" → "New Deployment"
   - Choose type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web App URL

### Step 4: Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
\`\`\`

Replace `YOUR_SCRIPT_ID` with the ID from your Google Apps Script Web App URL.

### Step 5: Test the Setup

1. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Open your browser** and go to `http://localhost:3000`

3. **Test form submission**:
   - Fill out the form completely
   - Try different positions to test conditional fields
   - Submit and check your Google Sheet for data

## 📁 Project Structure

\`\`\`
iedc-execom-form/
├── app/
│   ├── api/submit-to-google/route.ts    # API endpoint for form submission
│   ├── page.tsx                         # Main form component
│   └── layout.tsx                       # App layout
├── components/
│   ├── ui/                             # Shadcn UI components
│   ├── setup-instructions.tsx          # Setup guide component
│   └── integration-options.tsx         # Integration alternatives
├── lib/
│   ├── utils.ts                        # Utility functions
│   └── google-direct-integration.ts    # Google integration helpers
├── scripts/
│   └── google-apps-script.js           # Google Apps Script code
├── public/
│   └── images/
│       └── iedc-background.png         # Default background image
├── .env.local                          # Environment variables (create this)
└── README.md                           # This file
\`\`\`

## 🎯 Form Features

### Basic Fields (All Positions)
- Full Name
- Department (CSE, AI&DS, EEE, ECE, EBE, CE, ME)
- Section (A, B, C)
- Phone Number (10 digits)
- Email Address
- Position Selection
- Other Society Execom (Yes/No with conditional follow-up)
- Previous Experience

### Position-Specific Fields
- **Technology Lead**: GitHub profile link required
- **Design Lead**: Project file upload required (JPG, JPEG, PNG, PDF)

### Available Positions
1. IEDC Lead
2. Event Lead and IPR
3. Technology Lead
4. Quality and Operations Lead
5. Finance Lead
6. Creative and Innovation Lead
7. Design Lead
8. Community Lead
9. Branding and Marketing Lead
10. Women Entrepreneurship Lead

## 🔧 Customization

### Change WhatsApp Group Link
Edit the WhatsApp URL in `app/page.tsx`:
\`\`\`javascript
onClick={() => window.open("https://chat.whatsapp.com/YOUR-GROUP-LINK", "_blank")}
\`\`\`

### Update Background Image
Replace `public/images/iedc-background.png` with your custom image, or users can upload their own through the form.

### Modify Form Fields
Edit the arrays in `app/page.tsx`:
\`\`\`javascript
const departments = ["CSE", "AI&DS", "EEE", "ECE", "EBE", "CE", "ME"]
const sections = ["A", "B", "C"]
const positions = [/* your positions */]
\`\`\`

### Add New Position-Specific Fields
1. Add validation in the `validateForm()` function
2. Add conditional rendering in the JSX
3. Update the Google Apps Script to handle new fields

## 📊 Data Storage

### Google Sheets Columns
The form automatically creates these columns in your Google Sheet:
1. Timestamp
2. Name
3. Department
4. Section
5. Phone
6. Email
7. Position
8. Other Society Execom
9. Which Society
10. Experience
11. GitHub Link
12. Design Project File URL

### Google Drive Storage
- **Folder**: "IEDC Applications - Design Lead Projects"
- **File naming**: `ApplicantName_DesignProject_OriginalFileName.ext`
- **Access**: View-only public links stored in Google Sheet

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🔍 Troubleshooting

### Common Issues

**Form submission fails**:
- Check if `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` is set correctly
- Verify Google Apps Script is deployed as "Anyone" can access
- Check browser console for error messages

**Files not uploading**:
- Ensure Google Apps Script has Drive permissions
- Check file size (should be under 10MB)
- Verify file format is supported

**Data not appearing in Google Sheets**:
- Confirm Sheet ID is correct in Google Apps Script
- Check if script has Sheets permissions
- Look at Apps Script execution logs

### Getting Help

1. **Check the browser console** for error messages
2. **Review Google Apps Script logs** in the Apps Script editor
3. **Test with simple data** first before complex submissions
4. **Verify all environment variables** are set correctly

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions about IEDC ASIET, please contact:
- Email: [your-email@example.com]
- WhatsApp: [Your WhatsApp Group Link]

---

**Built with ❤️ for IEDC ASIET Executive Committee Recruitment**
