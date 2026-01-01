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

  const gmailWebUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;

  // Case 1: Desktop - Open Gmail Web in new tab
  if (!isMobile) {
    window.open(gmailWebUrl, '_blank');
    return;
  }

  // Case 2: Android - Use Native Intent with browser fallback
  // - package=com.google.android.gm forces the Gmail app specifically
  // - S.browser_fallback_url handles cases where the app is missing (WITHOUT JS TIMERS)
  if (isAndroid) {
    const androidIntent = `intent://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}#Intent;scheme=https;package=com.google.android.gm;S.browser_fallback_url=${encodeURIComponent(gmailWebUrl)};end`;
    window.location.href = androidIntent;
    return;
  }

  // Case 3: iOS & Others - Use standard mailto
  // This is the most gesture-compliant and reliable method for iOS.
  // It will open the system's default mail app (Gmail, Apple Mail, etc.)
  window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};
