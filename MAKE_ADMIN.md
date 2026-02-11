# Make User Admin

## Instructions

1. **First, sign up** with the email `bond0007@gmail.com` and password `Bond@123` at:
   - http://localhost:3000/signup

2. **After signup**, run this command in a new terminal or use Postman:

```bash
curl -X POST http://localhost:3000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"bond0007@gmail.com\"}"
```

**Or use PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/make-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email": "bond0007@gmail.com"}'
```

3. **Logout and login again** to see admin access

---

## Alternative: Direct MongoDB Update

If you have MongoDB Compass or mongosh:

```javascript
db.users.updateOne(
  { email: "bond0007@gmail.com" },
  {
    $set: {
      role: "admin",
      "permissions.manageUsers": true,
      "permissions.manageCorpus": true,
      "permissions.manageDB": true,
      "permissions.viewChats": true,
      isActive: true
    }
  }
)
```

---

## Security Note

⚠️ The `/api/admin/make-admin` endpoint should be **disabled in production** or protected with a secret key!
