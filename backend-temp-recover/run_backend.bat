@echo off
setlocal

echo ==========================================
echo      ShubhVivah Backend Launcher
echo ==========================================

REM Check if Java is in PATH
where java >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Java found in PATH.
    java -version
    goto :RUN_APP
)

echo [WARN] Java not found in PATH. Searching common locations...

REM Try to find JDK 17+ in standard locations
set "JAVA_SEARCH_DIRS=C:\Program Files\Java;C:\Program Files (x86)\Java;%USERPROFILE%\.jdks"

for %%d in ("%JAVA_SEARCH_DIRS:;=" "%") do (
    if exist "%%~d" (
        for /d %%j in ("%%~d\jdk-17*") do (
            if exist "%%j\bin\java.exe" (
                set "JAVA_HOME=%%j"
                set "PATH=%%j\bin;%PATH%"
                echo [INFO] Found Java at: %%j
                goto :RUN_APP
            )
        )
        for /d %%j in ("%%~d\jdk-21*") do (
             if exist "%%j\bin\java.exe" (
                set "JAVA_HOME=%%j"
                set "PATH=%%j\bin;%PATH%"
                 echo [INFO] Found Java at: %%j
                goto :RUN_APP
            )
        )
    )
)

echo [ERROR] Could not find a suitable Java JDK (17 or higher).
echo Please install JDK 17 from https://adoptium.net/
pause
exit /b 1

:RUN_APP
echo.
echo [INFO] Starting Spring Boot Application...
echo [CMD] mvnw.cmd spring-boot:run
echo.

call mvnw.cmd spring-boot:run

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Application failed to start.
)

echo.
pause
