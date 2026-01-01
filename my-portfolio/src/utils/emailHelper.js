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
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Case 1: Desktop - Open Gmail Web in new tab (Direct)
  if (!isMobile) {
    const email = "bharadwajflasmup@gmail.com";
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const gmailWebUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailWebUrl, '_blank');
    return;
  }

  // Case 2: Mobile - Trigger the Cinematic Chooser
  // We dispatch a custom event that EmailChooser.jsx listens for.
  const event = new CustomEvent("open-email-chooser", {
    detail: { subject, body }
  });
  window.dispatchEvent(event);
};
