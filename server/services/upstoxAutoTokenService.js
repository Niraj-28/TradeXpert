import puppeteer from "puppeteer";
import { generateSync } from "otplib";
import axios from "axios";
import fs from "fs";
import path from "path";

// Function to automatically refresh Upstox token
export const autoRefreshUpstoxToken = async () => {
  const apiKey = process.env.UPSTOX_API_KEY;
  const apiSecret = process.env.UPSTOX_API_SECRET;
  const redirectUri = process.env.UPSTOX_REDIRECT_URI;
  const clientId = process.env.UPSTOX_CLIENT_ID;
  const pin = process.env.UPSTOX_PIN;
  const totpKey = process.env.UPSTOX_TOTP_KEY;

  if (!apiKey || !apiSecret || !redirectUri || !clientId || !pin || !totpKey) {
    console.error("⚠️ Missing Upstox daily login configuration variables in .env file. Skipping auto-login.");
    return false;
  }

  // Ensure placeholders have been replaced by the user
  if (clientId.includes("YOUR_") || pin.includes("YOUR_")) {
    console.warn("⚠️ Please configure your real UPSTOX_CLIENT_ID and UPSTOX_PIN in .env to enable auto-login.");
    return false;
  }

  const authUrl = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${apiKey}&redirect_uri=${redirectUri}`;

  console.log("🚀 Starting Upstox Headless Auto Login...");
  
  // Launch browser (headless mode)
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    // 1. Go to OAuth authorization dialog
    console.log("🔗 Opening Upstox Login Page...");
    await page.goto(authUrl, { waitUntil: "networkidle2", timeout: 45000 });

    // 2. Input mobile number
    console.log("📱 Entering Mobile Number...");
    await page.waitForSelector("input#mobileNum", { visible: true, timeout: 20000 });
    await page.type("input#mobileNum", clientId, { delay: 100 });
    
    // Click Get OTP
    await page.click("button#getOtp");
    console.log("📩 Requesting OTP/TOTP...");

    // 3. Generate TOTP and input
    console.log("⏱️ Generating TOTP...");
    const totpCode = generateSync({ secret: totpKey });
    console.log(`🔑 Generated TOTP Code: ${totpCode}`);

    // Wait for the OTP/TOTP input field
    await page.waitForSelector("input#otpNum", { visible: true, timeout: 20000 });
    await page.type("input#otpNum", totpCode, { delay: 100 });

    // Click Continue
    await page.click("button#continueBtn");
    console.log("👉 Submitted TOTP...");

    // 4. Input PIN
    console.log("🔒 Entering 6-Digit PIN...");
    await page.waitForSelector("input#pinNum", { visible: true, timeout: 20000 });
    await page.type("input#pinNum", pin, { delay: 100 });
    
    // Click Continue to login
    await page.click("button#continueBtn");
    console.log("🚀 Submitting Login...");

    // 5. Wait for the redirect back to redirect_uri
    console.log("🔄 Waiting for callback redirect...");
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 });
    
    const finalUrl = page.url();
    console.log(`📍 Redirected to: ${finalUrl}`);

    // 6. Extract auth code
    const urlObj = new URL(finalUrl);
    const authCode = urlObj.searchParams.get("code");
    
    if (!authCode) {
      throw new Error(`Auth code not found in redirect URL: ${finalUrl}`);
    }

    console.log("🎟️ Received Auth Code. Exchanging for Access Token...");

    // 7. Call token exchange API
    const response = await axios.post("https://api.upstox.com/v2/login/authorization/token", 
      new URLSearchParams({
        code: authCode,
        client_id: apiKey,
        client_secret: apiSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept": "application/json"
        }
      }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new Error("Token exchange response did not contain access_token.");
    }

    console.log(`✅ Success! New Access Token: ${accessToken}`);

    // 8. Update running process env
    process.env.UPSTOX_ACCESS_TOKEN = accessToken;

    // 9. Update the local .env file
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");
      
      // Replace existing token or add it
      if (envContent.includes("UPSTOX_ACCESS_TOKEN=")) {
        envContent = envContent.replace(/UPSTOX_ACCESS_TOKEN=.*/, `UPSTOX_ACCESS_TOKEN=${accessToken}`);
      } else {
        envContent += `\nUPSTOX_ACCESS_TOKEN=${accessToken}`;
      }
      
      fs.writeFileSync(envPath, envContent, "utf8");
      console.log("💾 Saved new token to server/.env file.");
      return true;
    } else {
      console.warn("⚠️ server/.env file not found. Could not save token to file.");
      return true;
    }

  } catch (err) {
    console.error("❌ Upstox automated token refresh failed:", err.message);
    // Print page screenshot debug helper
    try {
      await page.screenshot({ path: "upstox-login-error.png" });
      console.log("📸 Error screenshot saved to upstox-login-error.png");
    } catch (ssErr) {
      console.error("Could not capture error screenshot:", ssErr.message);
    }
    return false;
  } finally {
    await browser.close();
  }
};
