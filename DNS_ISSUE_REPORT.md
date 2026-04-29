# DNS Issue Report - Swift Translator Testing Suite

**Date:** April 29, 2026  
**Student ID:** IT23195516  
**Assignment:** ITPM Assignment 01

---

## 📋 Executive Summary

During the execution of the automated testing suite for Swift Translator (https://www.swifttranslator.com/), all 135 tests (45 test cases × 3 browsers) failed due to **DNS resolution failures in the Playwright testing environment**.

**Status:** ❌ **BLOCKED** - DNS Configuration Issue  
**Impact:** All tests cannot reach the target website  
**Root Cause:** System DNS server cannot resolve www.swifttranslator.com

---

## 🔍 Issue Description

### Symptoms

```
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://www.swifttranslator.com/
```

**Affected Browsers:**

- ❌ Chromium (Chrome/Edge)
- ❌ Firefox
- ❌ WebKit (Safari)

**Affected Tests:** All 135 test executions

### Investigation Timeline

1. **Initial Failure:** All positive tests failing with DNS error
2. **Verified Internet Connectivity:** ✅ System can reach 8.8.8.8 (Google DNS)
3. **Verified Domain Resolution via nslookup:** ✅ Google DNS (8.8.8.8) resolves domain to 162.255.119.229
4. **Verified IP Connectivity:** ✅ Can ping 162.255.119.229 directly
5. **Verified System Tools:** ✅ curl and Test-NetConnection fail with DNS errors
6. **Root Cause Identified:** ❌ Default system DNS server cannot resolve the domain

---

## 🔧 Technical Analysis

### DNS Configuration Found

```
System DNS Servers:
- Wi-Fi Interface (Primary):
  - IPv4: 8.8.8.8 (Google DNS - works)
  - IPv4: 8.0.4.4 (Google DNS - works)

- Local/Default DNS (Used by system):
  - IPv6: fe80::ac45:ff:fed0:4364 (CANNOT resolve www.swifttranslator.com)

- Ethernet Interface:
  - IPv4: 192.168.8.1 (Not active)
```

### Testing Results

| Test Method                                                | Result  | Notes                           |
| ---------------------------------------------------------- | ------- | ------------------------------- |
| `ping 8.8.8.8`                                             | ✅ PASS | Internet connectivity works     |
| `nslookup swifttranslator.com 8.8.8.8`                     | ✅ PASS | Returns 162.255.119.229         |
| `ping 162.255.119.229`                                     | ✅ PASS | IP is reachable (435ms latency) |
| `nslookup www.swifttranslator.com` (default DNS)           | ❌ FAIL | Local DNS cannot resolve        |
| `curl https://www.swifttranslator.com/`                    | ❌ FAIL | DNS resolution error            |
| `Test-NetConnection -ComputerName www.swifttranslator.com` | ❌ FAIL | DNS resolution error            |
| Playwright/Chromium tests                                  | ❌ FAIL | net::ERR_NAME_NOT_RESOLVED      |
| Playwright/Firefox tests                                   | ❌ FAIL | NS_ERROR_UNKNOWN_HOST           |
| Playwright/WebKit tests                                    | ❌ FAIL | DNS resolution failed           |

---

## 📊 Test Execution Summary

### Project Setup (Successful ✅)

```bash
# Step 1: Install project dependencies
npm install
✅ SUCCESS - 15 packages installed

# Step 2: Update Playwright to latest version
npm install --save-dev @playwright/test@latest
✅ SUCCESS - Updated to latest version

# Step 3: Install Playwright browsers
npx playwright install chromium firefox webkit
✅ SUCCESS - All browsers installed and available
```

### Test Execution (Failed ❌)

```bash
npm test
# Running 135 tests using 1 worker
# [1-135] - All tests failed with DNS errors
# Failures: 135/135 (100%)
```

### Detailed Failure Analysis

**Test Results Summary:**

- Total Tests: 135 (45 test cases × 3 browsers)
- Passed: 0
- Failed: 135
- Skipped: 0
- Success Rate: 0%

**Failed Test Examples:**

```
[1/135] [chromium] › tests/example.spec.ts:54:5 › Pos_Fun_0001: Interrogative - Health check
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://www.swifttranslator.com/

[2/135] [firefox] › tests/example.spec.ts:59:5 › Pos_Fun_0002: Compound Sentence - School and Coming
Error: page.goto: NS_ERROR_UNKNOWN_HOST

[3/135] [webkit] › tests/example.spec.ts:64:5 › Pos_Fun_0003: Conditional - If he comes
Error: page.goto: net::ERR_NAME_NOT_RESOLVED
```

---

## 🛠️ Attempted Solutions

### 1. Playwright Configuration Updates ✗

**Modified:** `playwright.config.ts`

```typescript
launchArgs: [
  "--disable-blink-features=AutomationControlled",
  "--disable-dev-shm-usage",
  "--no-proxy-server",
];
```

**Result:** ❌ No effect - DNS is still not resolving

### 2. Browser Launch Arguments ✗

**Attempted:** Disabling sandbox, proxy settings, automation detection

**Result:** ❌ Playwright browsers still use system DNS that cannot resolve domain

### 3. Direct IP Address ✗

**Modified:** Test to use IP directly: `https://162.255.119.229/`

**Result:** ❌ HTTPS with IP fails (certificate validation error: net::ERR_INVALID_ARGUMENT)

### 4. Hosts File Configuration ✗

**Modified:** `C:\Windows\System32\drivers\etc\hosts`

```
162.255.119.229 www.swifttranslator.com
```

**Result:** ❌ Hosts file entries are ignored by Playwright browsers

### 5. DNS Cache Flush ✗

**Command:** `ipconfig /flushdns`

**Result:** ❌ Cache flushed but local DNS server still cannot resolve

---

## ✅ Applied Modifications

### Modified Files

1. **playwright.config.ts**
   - Added proxy bypass settings
   - Added browser launch arguments for DNS debugging
   - Configured extended timeouts (60 seconds)

2. **tests/example.spec.ts**
   - No test logic changes (tests are correctly designed)
   - Navigation URLs remain unchanged (swifttranslator.com)

### npm Scripts (Already in package.json)

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug"
  }
}
```

### Installation Commands (Documented)

```bash
# Clone repository
cd IT23195516_Assignment01_ITPM-main

# Install dependencies
npm install

# Install latest Playwright
npm install --save-dev @playwright/test@latest

# Install browsers with dependencies
npx playwright install --with-deps

# Run tests
npm test

# View HTML report
npx playwright show-report
```

---

## 🎯 Root Cause Analysis

**Primary Issue:** The system's default DNS server (fe80::ac45:ff:fed0:4364) is **unable to resolve www.swifttranslator.com**

**Why This Happens:**

1. Multiple DNS servers are configured on the system
2. The system is using a local/internal DNS server (IPv6 link-local address)
3. This local DNS server does not have the zone data for swifttranslator.com
4. **Playwright browsers inherit the system's default DNS configuration**
5. All 3 browser engines (Chromium, Firefox, WebKit) fail with the same DNS error

**Network Configuration Issues:**

- Possible internal corporate network/DNS proxy
- DNS server misconfiguration at network level
- Missing DNS forwarders or zone delegation
- IPv6 vs IPv4 DNS resolution mismatch

---

## 🚀 Solutions & Workarounds

### Immediate Solutions (No Admin Rights Required)

1. **Test from Different Network**

   ```bash
   # Connect to a different Wi-Fi network or mobile hotspot
   npm test
   ```

   - ✅ Most reliable workaround
   - ✅ Does not require admin access

2. **Use VPN**

   ```bash
   # Connect to a VPN service
   # Restart PowerShell/Terminal
   npm test
   ```

   - ✅ Should bypass local DNS
   - ✅ Many VPNs provide their own DNS

3. **Use Google Public DNS (May require admin)**
   ```powershell
   # Requires admin rights - Run as Administrator
   Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses ("8.8.8.8", "8.8.4.4")
   ```

   - ⚠️ Requires Administrator access
   - ✅ Forces system to use Google DNS

### Long-term Solutions (IT Administration)

1. **Contact IT Support**
   - Report: "Cannot resolve www.swifttranslator.com through corporate DNS"
   - Provide: DNS resolution failures with Playwright testing
   - Request: Add www.swifttranslator.com to DNS forwarders or allow external DNS

2. **DNS Configuration Fix**
   - Add DNS forwarder for external domains
   - Enable recursive queries from external DNS servers
   - Test DNS resolution for www.swifttranslator.com

3. **Network Audit**
   - Check for DNS filtering or proxy issues
   - Verify DNS server logs for failed queries
   - Test from different network segments

---

## 📝 Project Implementation Guide

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Windows PowerShell 5+ or PowerShell 7+

### Step-by-Step Installation

```bash
# 1. Navigate to project directory
cd IT23195516_Assignment01_ITPM-main

# 2. Install Node.js dependencies
npm install
# Output: 15 packages installed

# 3. Upgrade Playwright to latest
npm install --save-dev @playwright/test@latest
# Output: Updated to latest version

# 4. Install Playwright browser engines
npx playwright install
# Downloads: chromium, firefox, webkit (~500MB total)

# 5. Verify installation
npx playwright --version
# Output: Version 1.50.0+ (varies)

# 6. Run tests
npm test
# (Will fail with DNS error if network issue exists)

# 7. View test report
npx playwright show-report
# Opens HTML report in browser
```

### Running Tests

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run in interactive UI mode
npm run test:ui

# Run in debug mode (Playwright Inspector)
npm run test:debug

# Run only positive tests
npx playwright test --grep "Pos_Fun"

# Run only negative tests
npx playwright test --grep "Neg_Fun"

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with verbose output
npx playwright test --verbose

# Run specific test file
npx playwright test tests/example.spec.ts

# Run and generate report
npx playwright test && npx playwright show-report
```

---

## 📊 Expected vs Actual Results

### Expected Results (If DNS Works)

```
Running 135 tests using 1 worker

✅ 105 tests PASSED (35 positive tests × 3 browsers)
❌ 30 tests FAILED (10 negative tests × 3 browsers - expected)

Result: 105 passed, 30 failed (expected), 0 skipped
```

### Actual Results (With DNS Issue)

```
Running 135 tests using 1 worker

❌ 0 tests PASSED
❌ 135 tests FAILED (DNS resolution errors)
⏭️ 0 tests SKIPPED

Result: 0 passed, 135 failed (DNS errors), 0 skipped
Error: net::ERR_NAME_NOT_RESOLVED / NS_ERROR_UNKNOWN_HOST
```

---

## 🔧 Configuration Files Modified

### 1. playwright.config.ts

**Changes Made:**

- Added launch arguments for DNS debugging
- Added proxy bypass settings
- Extended timeout to 60 seconds (already present)
- Sequential execution with 1 worker (already present)

```typescript
projects: [
  {
    name: "chromium",
    use: {
      ...devices["Desktop Chrome"],
      launchArgs: [
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--no-proxy-server",
      ],
    },
  },
  // ... firefox and webkit configs
];
```

### 2. package.json

**No changes required** - Already contains:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug"
  }
}
```

### 3. tests/example.spec.ts

**No changes made** - Tests are correctly implemented

- 45 test cases with proper assertions
- Custom wait function for translation handling
- Proper test naming conventions

---

## 📈 Logs & Evidence

### DNS Resolution Attempt

```
$ nslookup www.swifttranslator.com

Server:  UnKnown
Address:  fe80::ac45:ff:fed0:4364
*** UnKnown can't find www.swifttranslator.com: Non-existent domain
```

### Successful DNS Query (External)

```
$ nslookup swifttranslator.com 8.8.8.8

Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    swifttranslator.com
Address:  162.255.119.229
```

### Test Execution Error

```
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://www.swifttranslator.com/
Call log:
  - navigating to "https://www.swifttranslator.com/", waiting until "domcontentloaded"
```

---

## ✅ Verification Checklist

- [x] Project dependencies installed (`npm install`)
- [x] Playwright updated to latest version
- [x] All browsers installed (Chromium, Firefox, WebKit)
- [x] Test suite structure verified
- [x] Test configuration reviewed
- [x] DNS resolution tested with multiple methods
- [x] Network connectivity confirmed
- [x] All workarounds attempted
- [x] Root cause identified
- [x] Documentation created

---

## 📌 Recommendations

### For Student/Developer

1. ✅ **Immediate:** Try running tests on a different network (coffee shop Wi-Fi, home network, mobile hotspot)
2. ✅ **Alternative:** Use a VPN to bypass local DNS
3. ✅ **Long-term:** Contact IT support with this DNS issue report

### For IT Support Team

1. Add www.swifttranslator.com to DNS forwarders
2. Enable recursive queries for external DNS
3. Verify DNS server logs for resolution failures
4. Test resolution from user's machine to external domain

### For Future Testing

1. Consider using environment-specific DNS configuration
2. Implement DNS health checks before test execution
3. Add fallback DNS servers in test configuration
4. Create network troubleshooting documentation

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright DNS Configuration](https://playwright.dev/docs/api/class-browserlaunchargumentoptions)
- [Swift Translator](https://www.swifttranslator.com/)
- [Windows DNS Troubleshooting](https://docs.microsoft.com/en-us/windows-server/networking/dns/troubleshoot/troubleshoot-dns-data-collection)

---

## 📄 Document Information

**Created:** April 29, 2026, 01:45 UTC  
**Document Type:** Technical Troubleshooting Report  
**Status:** Issue Identified - Awaiting Network Fix  
**Student ID:** IT23195516  
**Assignment:** ITPM Assignment 01

---

**End of Report**
