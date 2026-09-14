/**
 * Hemisphere Hotels & Resorts — Cookie Preferences & Consent Manager
 * Privacy & GDPR Compliance Layer
 */

export function initCookieConsent() {
  const CONSENT_KEY = 'hemi_cookie_consent';
  const existingConsent = localStorage.getItem(CONSENT_KEY);

  if (!existingConsent) {
    showBanner();
  }

  function showBanner() {
    let banner = document.getElementById('cookie-consent-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cookie-consent-banner';
      banner.innerHTML = `
        <style>
          #cookie-consent-banner {
            position: fixed;
            bottom: 24px;
            left: 24px;
            right: 24px;
            max-width: 520px;
            background: rgba(17, 21, 23, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            color: #F9F6F0;
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 24px;
            border-radius: 4px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            font-family: var(--font-body, sans-serif);
            font-size: 13px;
            line-height: 1.5;
            animation: fadeInUp 0.4s ease-out;
          }
          #cookie-consent-banner h4 {
            font-family: var(--font-display, serif);
            font-size: 18px;
            margin-bottom: 8px;
            color: var(--hemi-brass, #C5A880);
          }
          #cookie-consent-banner p {
            margin-bottom: 16px;
            color: #DDD5C7;
            font-size: 12px;
          }
          #cookie-consent-banner a {
            color: var(--hemi-brass, #C5A880);
            text-decoration: underline;
          }
          .cookie-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .cookie-btn {
            padding: 9px 18px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-weight: 600;
            cursor: pointer;
            border-radius: 2px;
            border: 1px solid var(--hemi-brass, #C5A880);
            background: var(--hemi-brass, #C5A880);
            color: #111517;
            transition: all 0.2s;
          }
          .cookie-btn:hover {
            background: #fff;
            border-color: #fff;
          }
          .cookie-btn--outline {
            background: transparent;
            color: #F9F6F0;
            border-color: rgba(255, 255, 255, 0.3);
          }
          .cookie-btn--outline:hover {
            border-color: #fff;
            background: rgba(255, 255, 255, 0.1);
          }
        </style>
        <h4>Your Privacy Experience</h4>
        <p>We use essential cookies to ensure optimal functionality. Optional cookies help personalize your luxury experience and analyze our portfolio traffic. Review our <a href="/privacy/">Privacy Policy</a>.</p>
        <div class="cookie-actions">
          <button class="cookie-btn" id="cookie-accept-all">Accept All</button>
          <button class="cookie-btn cookie-btn--outline" id="cookie-essential-only">Essential Only</button>
        </div>
      `;
      document.body.appendChild(banner);

      document.getElementById('cookie-accept-all').addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true }));
        banner.remove();
      });

      document.getElementById('cookie-essential-only').addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false }));
        banner.remove();
      });
    }
  }
}
