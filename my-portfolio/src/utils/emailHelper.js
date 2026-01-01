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

  // Desktop Flow
  if (!isMobile) {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank');
    return;
  }

  // Mobile Flow
  let appUrl = "";
  
  if (isAndroid) {
    // Precise Android Intent for Gmail App
    // This removes "mailto:" from the recipient field and forces the app
    appUrl = `intent:#Intent;action=android.intent.action.SENDTO;data=mailto:${email};package=com.google.android.gm;S.android.intent.extra.SUBJECT=${encodedSubject};S.android.intent.extra.TEXT=${encodedBody};end;`;
  } else if (isiOS) {
    // iOS Gmail Deep Link
    appUrl = `googlegmail:///co?to=${email}&subject=${encodedSubject}&body=${encodedBody}`;
  } else {
    // Generic Mobile Fallback
    appUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  // Failsafe mechanism: Attempt to open the app, if it fails to take focus, open web.
  const start = Date.now();
  window.location.href = appUrl;

  setTimeout(() => {
    // If the browser is still in focus after 1.5s, it means the app likely didn't open
    if (Date.now() - start < 2000) {
      const webFallback = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;
      window.location.href = webFallback;
    }
  }, 1500);
};
