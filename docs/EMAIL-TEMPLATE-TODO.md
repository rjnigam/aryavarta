# Email Template Styling Issue - Low Priority

**Status**: Tabled for later  
**Priority**: Low (aesthetic only, functionality works)  
**Date**: October 26, 2025

## Current State

✅ **Email verification is working correctly**
- SMTP configured with Resend (smtp.resend.com)
- Emails are being sent and delivered
- Verification links work properly
- Username is included in emails

❌ **Email template is plain, not branded**
- Custom Aryavarta template designed but not rendering
- Currently showing basic Supabase default styling
- Missing: orange gradient header, proper branding, styled buttons

## What We've Tried

1. **Configured SMTP in Supabase**
   - Host: smtp.resend.com
   - Port: 465
   - Username: resend
   - Password: Aryavarta API key (re_NX9AuNt6...)
   - Status: ✅ Working

2. **Created custom HTML template**
   - Beautiful Aryavarta-branded design
   - Orange gradient header
   - Personalized greeting with first name
   - Username display
   - Location: Saved in Supabase → Authentication → Email Templates → Confirm signup

3. **Issue**: SMTP seems to bypass custom templates
   - Template saves successfully
   - But plain text version sends instead
   - Might be SMTP provider limitation
   - Might need different Supabase configuration

## The Beautiful Template (For Reference)

The custom template is saved in Supabase Email Templates. It includes:
- Orange gradient header (#f97316 to #c2410c)
- "Aryavarta - Wisdom from the Vedic tradition" branding
- Personalized "Namaste [FirstName] 🙏" greeting
- Username display in monospace font
- Styled CTA button
- "Dharma protects those who uphold it" footer quote
- Mobile-responsive design

## To Fix Later

**Potential solutions to investigate:**

1. **Check Resend SMTP template settings**
   - Resend might have its own template system for SMTP
   - May need to configure templates in Resend dashboard

2. **Try different SMTP port**
   - Port 587 (TLS) instead of 465 (SSL)
   - Some providers handle templates differently by port

3. **Use custom email function instead**
   - Re-enable the `sendVerificationEmail` function
   - Disable Supabase's automatic emails
   - Full control over email design
   - Tradeoff: More maintenance

4. **Contact Supabase support**
   - Ask why custom HTML templates aren't working with SMTP
   - May be a known limitation or setting we're missing

## Related Files

- `/app/api/auth/signup/route.ts` - Signup endpoint (custom email code removed)
- `/lib/email/sendVerificationEmail.ts` - Custom email function (currently unused)
- Supabase Dashboard → Authentication → Email Templates → Confirm signup

## Decision

**Since functionality works perfectly, we're tabling this for later.**  
This is purely an aesthetic issue and doesn't block users from signing up and verifying their emails.

---

**Next time we revisit this:**
- Check Resend documentation for SMTP template configuration
- Consider switching back to custom email implementation
- Or accept plain emails as "good enough" for now
