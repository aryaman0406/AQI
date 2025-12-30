# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not create a public GitHub issue for security vulnerabilities as this could put users at risk.

### 2. Report Privately

Send an email to: **security@yourdomain.com** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 30 days
  - Medium/Low: Within 90 days

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**
   ```bash
   # Backend
   pip install --upgrade -r requirements.txt
   
   # Frontend
   npm update
   ```

2. **Use Environment Variables**
   - Never commit `.env` files
   - Keep API keys secure
   - Rotate credentials regularly

3. **Enable CORS Properly**
   - Configure allowed origins
   - Don't use wildcard (*) in production

4. **Rate Limiting**
   - Use rate limiting for API endpoints
   - Monitor unusual traffic patterns

### For Developers

1. **Code Security**
   - Validate all user inputs
   - Sanitize data before processing
   - Use parameterized queries for databases
   - Implement proper authentication/authorization

2. **Dependencies**
   - Run security audits regularly:
     ```bash
     # Python
     pip-audit
     
     # Node.js
     npm audit
     ```
   - Keep dependencies up to date
   - Remove unused dependencies

3. **API Keys**
   - Never hardcode API keys
   - Use environment variables
   - Rotate keys regularly
   - Limit key permissions

4. **HTTPS**
   - Use HTTPS in production
   - Implement proper SSL/TLS certificates
   - Force secure connections

## Known Security Considerations

### API Rate Limiting
The API implements rate limiting to prevent abuse. Default: 60 requests/minute per IP.

### CORS Configuration
Configure `ALLOWED_ORIGINS` in `.env` to restrict access to trusted domains only.

### Data Privacy
- No personal data is stored without consent
- Location data is used only for AQI queries
- No tracking of user behavior

### Third-Party APIs
- OpenAQ API: Public air quality data
- Weather API: Public weather data
- Verify SSL certificates when making external requests

## Disclosure Policy

When we receive a security report:

1. We confirm the vulnerability
2. We determine the impact and severity
3. We develop and test a fix
4. We release the fix in a security update
5. We publicly disclose the vulnerability (with credit to reporter, if desired)

## Security Updates

Security updates will be announced via:
- GitHub Security Advisories
- Release notes
- Project README

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities (unless they prefer to remain anonymous).

---

Thank you for helping keep our project and users safe! 🔒
