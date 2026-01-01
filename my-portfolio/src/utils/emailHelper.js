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

  // 1. Desktop Flow - Guaranteed Success
  if (!isMobile) {
    window.open(gmailWebUrl, '_blank');
    return;
  }

  // 2. Android Flow - Modern Intent with Native Fallback
  // This is the most "Perfect" Android fix:
  // - package=com.google.android.gm forces the Gmail app.
  // - S.browser_fallback_url ensures that if the app is NOT installed, 
  //   the browser automatically opens the web version instead of doing nothing.
  if (isAndroid) {
    const androidIntent = `intent://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}#Intent;scheme=https;package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(gmailWebUrl)};end`;
    window.location.href = androidIntent;
    return;
  }

  // 3. iOS Flow - Deep Link with Timeout Failsafe
  if (isiOS) {
    const gmailAppUri = `googlegmail:///co?to=${email}&subject=${encodedSubject}&body=${encodedBody}`;
    const start = Date.now();
    
    // Attempt to open the app
    window.location.href = gmailAppUri;

    // Failsafe: iOS doesn't have a native "fallback" in the URL like Android.
    // So we wait 1.2s; if the user hasn't switched to the App (browser still active), we open web.
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = gmailWebUrl;
      }
    }, 1200);
    return;
  }

  // 4. Generic Mobile Fallback (e.g. windows phone, tablet browsers)
  window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};
