@echo off
echo Applying all fixes...
echo.

echo Step 1: Restoring Supabase...
node restore-supabase.js
if %errorlevel% neq 0 exit /b %errorlevel%

echo Step 2: Adding core fixes...
python final-fix.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo Step 3: Adding remove button...
python insert-button.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo Step 4: Adding improvements...
python add-improvements.py
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo All fixes applied successfully!
echo Your app should reload now.
