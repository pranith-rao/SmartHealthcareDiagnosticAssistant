# 🚀 START HERE - Team CursorMinds

## 📌 For Evaluators: How to Run This Application

We provide **TWO separate batch files** - choose the one that works for you!

---

## 🎯 Choose Your Method

<table>
<tr>
<td width="50%" valign="top">

### ⭐ Method 1: WITHOUT Docker
**File:** `Team_CursorMinds_Submission.bat`

**Just double-click this file!**

#### Requirements:
- ✅ Node.js 18+ installed

#### What happens:
1. Checks prerequisites
2. Installs dependencies
3. Builds React app
4. Starts server
5. Opens browser

#### Time:
- First run: 3-5 minutes
- After: 10 seconds

#### Best for:
- Quick evaluation
- Machines with Node.js
- Faster startup

</td>
<td width="50%" valign="top">

### 🐳 Method 2: WITH Docker
**File:** `Team_CursorMinds_Submission_Docker.bat`

**Just double-click this file!**

#### Requirements:
- ✅ Docker Desktop running

#### What happens:
1. Checks Docker
2. Builds images
3. Starts containers
4. Opens browser

#### Time:
- First run: 5-10 minutes
- After: 30 seconds

#### Best for:
- Isolated environment
- Production simulation
- No Node.js needed

</td>
</tr>
</table>

---

## ⚡ Quick Instructions

### If you have Node.js:
```
1. Double-click: Team_CursorMinds_Submission.bat
2. Wait for browser to open
3. Done! ✅
```

### If you prefer Docker:
```
1. Start Docker Desktop
2. Double-click: Team_CursorMinds_Submission_Docker.bat
3. Wait for browser to open
4. Done! ✅
```

### Not sure which to use?
```
Try: Team_CursorMinds_Submission.bat first
(It will tell you if Node.js is missing)
```

---

## 🌐 What You'll See

After running either batch file:

```
✅ Application starts automatically
✅ Browser opens to: http://localhost:3000
✅ Beautiful animated dashboard
✅ All features working
```

---

## 🧪 Quick Test

### 1. Visual Test
- Dashboard loads with animated cards
- Navigate between pages
- Click "Run Demo Analysis" in Diagnosis page

### 2. API Test
```powershell
curl http://localhost:3000/api/v1/health
```
Should return: `{"success": true}`

---

## 📂 Key Files

| What | Where |
|------|-------|
| **Main run file (No Docker)** | `Team_CursorMinds_Submission.bat` ⭐ |
| **Docker run file** | `Team_CursorMinds_Submission_Docker.bat` 🐳 |
| **Full documentation** | `docs/README.md` |
| **API specification** | `docs/API_SPECIFICATION.md` |
| **Prompts used (20%)** | `docs/PROMPTS_USED.md` |
| **Quick start guide** | `HOW_TO_RUN.md` |
| **This guide** | `START_HERE.md` (you are here) |

---

## 🛑 To Stop

**Manual run:** Press `Ctrl+C` in command window

**Docker run:** 
```powershell
docker-compose down
```

---

## ⚠️ Common Issues

### "Port 3000 already in use"
```powershell
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### "Node.js not found" (Method 1)
Install from: https://nodejs.org/

### "Docker not running" (Method 2)
Start Docker Desktop and wait for it to fully load

---

## ✅ Success Checklist

After running a batch file:

- [ ] Command window shows success messages
- [ ] Browser opens automatically
- [ ] Dashboard visible at http://localhost:3000
- [ ] Navigation works (5 pages)
- [ ] Health check returns success
- [ ] Demo analysis works

**All checked? Application is working! 🎉**

---

## 📖 Additional Resources

- **Complete setup guide:** See `HOW_TO_RUN.md`
- **API testing:** See `docs/API_SPECIFICATION.md`
- **Development prompts:** See `docs/PROMPTS_USED.md`
- **Project overview:** See `docs/README.md`

---

## 🎬 Demo for Presentation (3 minutes)

```
1. "Here are our two batch files for different environments"
   → Show: Team_CursorMinds_Submission.bat (no Docker)
            Team_CursorMinds_Submission_Docker.bat (with Docker)

2. "I'll run the application"
   → Double-click: Team_CursorMinds_Submission.bat

3. "Browser opens automatically to our dashboard"
   → Show: Beautiful animated UI

4. "Let's test a diagnostic analysis"
   → Click: Diagnosis → Run Demo Analysis
   → Show: Results with differential diagnoses

5. "All APIs are documented and working"
   → Show: docs/API_SPECIFICATION.md
   → Test: curl http://localhost:3000/api/v1/health

6. "Here's our prompt documentation for 20% criteria"
   → Show: docs/PROMPTS_USED.md
```

---

## 💡 Evaluation Criteria

✅ **Functionality (80%)**
- [x] Working batch files
- [x] All features functional
- [x] Beautiful animated UI
- [x] API endpoints working

✅ **Prompts Documentation (20%)**
- [x] All prompts documented
- [x] See `docs/PROMPTS_USED.md`

---

## 📊 Project Stats

- **Lines of Code:** ~5000+
- **API Endpoints:** 15+
- **Pages:** 5 (Dashboard, Patients, Diagnosis, Imaging, Reports)
- **Technologies:** MERN Stack + Docker
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS + Custom gradients

---

## 🏆 Team CursorMinds

**Technothon 2025**  
**Problem:** Smart Healthcare Diagnostic Assistant  
**Stack:** MongoDB + Express + React + Node.js  
**Submission Date:** October 30, 2025

---

## 🚀 Ready to Run?

### Pick your method and double-click:

1. **Team_CursorMinds_Submission.bat** (No Docker) ⭐
2. **Team_CursorMinds_Submission_Docker.bat** (With Docker) 🐳

**Both work perfectly - choose what's easier for you!**

---

### Need Help?

1. Read `HOW_TO_RUN.md` for detailed instructions
2. Check `docs/README.md` for full documentation
3. Review troubleshooting section above

---

**Let's go! Run the batch file and see it in action! 🎉**

