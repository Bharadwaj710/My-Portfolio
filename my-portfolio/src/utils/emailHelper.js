/**
 * Universal Smart Email Helper
 * 
 * Strategy:
 * 1. Desktop: Direct to premium Gmail web interface.
 * 2. Android: Use a strict Intent to open the Gmail app's compose activity.
 * 3. iOS: Use Gmail-specific URI scheme, fallback to mailto.
 * 4. Failsafe: If no app responds, redirect to Gmail web after a timeout.
 */

export const handleEmail = (subject = "", body = "") => {
  const email = "bharadwajflasmup@gmail.com";
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isiOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const gmailWebUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;

  // 1. Desktop Flow
  if (!isMobile) {
    window.open(gmailWebUrl, '_blank');
    return;
  }

  // 2. Android Flow - FORCE Gmail App via specific System Intent
  // We use the VIEW action with a mailto URI and specific package binding.
  // This is much harder for the browser to hijack than an https-based intent.
  if (isAndroid) {
    const androidIntent = `intent:#Intent;action=android.intent.action.VIEW;data=mailto:${email}?subject=${encodedSubject}&body=${encodedBody};package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(gmailWebUrl)};end`;
    window.location.href = androidIntent;
    return;
  }

  // 3. iOS Flow - Gmail-first with System and Web Fallbacks
  if (isiOS) {
    const gmailAppUri = `googlegmail:///co?to=${email}&subject=${encodedSubject}&body=${encodedBody}`;
    const mailtoUri = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    const start = Date.now();
    
    // Stage 1: Attempt Gmail specifically
    window.location.href = gmailAppUri;

    // Stage 2 & 3: Progressive Fallback if Gmail app isn't found
    setTimeout(() => {
      // If we're still in the browser after 1.5s
      if (Date.now() - start < 2000) {
        // Attempt system default mail app
        window.location.href = mailtoUri;
        
        // Wait another 1.2s; if STILL in browser, final fallback to web
        setTimeout(() => {
          if (Date.now() - start < 3500) {
            window.location.href = gmailWebUrl;
          }
        }, 1200);
      }
    }, 1500);
    return;
  }

  // 4. Generic Mobile Fallback
  window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};
