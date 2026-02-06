# Quick Setup Guide - Educational Content System

## 🔑 Required: Add Gemini API Key

Add this line to your `.env` file in the Backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your FREE Gemini API key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

## ✅ What's Already Done

- ✅ Backend models created
- ✅ Education routes configured
- ✅ 7 educational modules seeded
- ✅ Frontend Education page created
- ✅ Navigation link added
- ✅ **Authentication bug fixed** (403 error resolved)

## 🚀 Start the Application

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🧪 Test the Features

1. **Login** to your account
2. Navigate to **`/education`** page (click "Learn" in navbar)
3. **View educational modules** - 7 modules should appear
4. **Complete a module** - Click "Start Learning" → Read → "Complete Module"
5. **Take a quiz** - Click "Start Quiz" → Answer questions → Submit
6. **Check your points** - Points should increase after completing activities
7. **View impact stats** - See CO₂ saved, trees planted equivalent

## 🎯 Points Breakdown

- Complete educational module: **+50-100 points**
- Pass quiz (80%+): **+100 points**
- Perfect quiz (100%): **+150 points** (100 + 50 bonus)

## 🐛 Troubleshooting

**If you still get 403 errors:**
- Clear browser cache and localStorage
- Re-login to get a fresh token
- Check that backend server restarted after the fix

**If quiz generation fails:**
- Verify `GEMINI_API_KEY` is in `.env`
- Check backend console for error messages
- Ensure you have internet connection for AI API

## 📚 Features Available

✅ 7 comprehensive learning modules
✅ AI-powered quiz generation
✅ Points & rewards system
✅ Learning streak tracking
✅ Environmental impact visualization
✅ Module completion tracking
✅ Beautiful dark theme UI

Enjoy learning about e-waste disposal! 🌱
