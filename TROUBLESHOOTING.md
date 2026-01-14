# Troubleshooting "Connection Refused" Error

If you're getting "localhost refused to connect", follow these steps:

## Step 1: Install Dependencies
Make sure all dependencies are installed:
```bash
npm install
```

## Step 2: Start the Dev Server
Run the development server:
```bash
npm run dev
```

## Step 3: Check the Output
After running `npm run dev`, you should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

## Step 4: Access the Correct URL
- Make sure you're accessing: `http://localhost:5173` (not `https://`)
- If port 5173 is busy, Vite will automatically use the next available port
- Check the terminal output for the actual port number

## Step 5: Common Issues

### Port Already in Use
If port 5173 is already in use, Vite will try the next port (5174, 5175, etc.)
- Check the terminal output for the actual port
- Or kill the process using port 5173:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5173
  # Then kill the process using the PID shown
  ```

### Firewall Blocking
- Check if Windows Firewall is blocking the connection
- Try accessing `http://127.0.0.1:5173` instead of `http://localhost:5173`

### Dependencies Not Installed
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Cache Issues
- Clear Vite cache:
  ```bash
  rm -rf node_modules/.vite
  # Or on Windows PowerShell:
  Remove-Item -Recurse -Force node_modules\.vite
  ```

## Still Having Issues?
1. Check the terminal/console for error messages
2. Make sure Node.js version is 18 or higher: `node --version`
3. Try a different browser
4. Check if antivirus software is blocking the connection
