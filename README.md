# Mac Parts Inventory System

A QR-code based inventory system for Mac repair shops, with Google Sheets as the backend database.

## Features

- 📱 **QR Code Scanning** - Generate and scan QR codes for quick item lookup
- 🍎 **Complete Mac Coverage** - All Mac models from 1998-2025
- 📊 **Google Sheets Backend** - Your inventory lives in a spreadsheet you can view/edit anytime
- ✅ **Check In/Out Tracking** - Track which parts went to which repair job
- 🏷️ **Printable Labels** - Generate labels with QR codes
- 📱 **Mobile Friendly** - Works on phones and tablets

---

## Quick Start

### Demo Mode (No Setup)
The app works immediately using browser localStorage. Good for testing.

### Full Setup with Google Sheets (Recommended)
Follow steps below for permanent, shareable storage.

---

## Setup Instructions

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet named "Mac Parts Inventory"

### Step 2: Add the Apps Script
1. In your sheet: **Extensions > Apps Script**
2. Delete existing code, paste contents of `Code.gs` (see below)
3. Save and click **Run > testSetup** to initialize

### Step 3: Deploy Web App
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** and authorize
6. **Copy the Web app URL**

### Step 4: Update the React App
Find this line in `App.jsx`:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```
Replace with your URL:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

### Step 5: Deploy to Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repo and deploy
4. Share the URL with your dad!

---

## Using the App

- **Add Items**: Click + Add, select category and Mac model
- **Scan QR**: Click 📷 Scan, paste scanned code
- **Print Labels**: View item → Print Label → Save image
- **Check Out**: View item → Check Out → Enter job reference

---

## Tips for the Shop

1. **Label everything** when parts arrive
2. **Use locations** like "Shelf A1", "Bin 12"
3. **Track jobs** with ticket numbers
4. **Download the sheet** periodically as backup

---

## Google Sheet Columns

| Column | Description |
|--------|-------------|
| id | Unique ID (MAC-XXXXX) |
| category | Part type |
| partName | Description |
| macModel | Mac model family |
| screenSize | Display size |
| year | Model year |
| chip | Processor |
| modelNumber | A#### number |
| condition | Part condition |
| quantity | Stock count |
| location | Physical location |
| cost | Purchase cost |
| status | available/checked_out |

---

MIT License - Free to use!
