@echo off
echo.
echo ========================================
echo   FINAL FIX - All Admin Features
echo ========================================
echo.
echo Restoring clean version...
copy mastertec-new-clean\src\App.js.backup mastertec-new-clean\src\App.js >nul
echo.
echo Applying Supabase integration...
node restore-supabase.js
echo.
echo Enabling Users tab...
python fix-users-only.py
echo.
echo Starting app...
cd mastertec-new-clean
start npm start
echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo Your app is starting at: http://localhost:3000
echo.
echo CURRENT STATUS:
echo   - Users Tab: WORKING (fetches from Supabase)
echo   - Products Tab: WORKING
echo   - Reports Tab: Shows placeholder
echo.
echo To add Reports: Open ADD-REPORTS-MANUALLY.md
echo.
pause
