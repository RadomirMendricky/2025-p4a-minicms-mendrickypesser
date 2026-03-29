'use client';

import { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import Script from 'next/script';

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem('cookie_consent'));
  }, []);

  const showBanner = consent === null;
  const hasConsent = consent === 'granted';

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsent('granted');
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsent('denied');
  };

  useEffect(() => {
    if (hasConsent && typeof window !== 'undefined') {
      const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
      if (clarityId && clarityId !== 'sem_vlozte_vas_id') {
        import('@microsoft/clarity').then((ClarityModule) => {
          const clarity = ClarityModule.default;
          if (clarity && typeof clarity.init === 'function') {
            clarity.init(clarityId);
          }
        });
      }
    }
  }, [hasConsent]);

  return (
    <>

      {showBanner && (
        <div className="fixed-bottom text-white shadow-lg z-3 cookie-consent">
          <Container className="d-flex flex-column flex-md-row py-3 justify-content-between align-items-center gap-3">
            <div>
              <strong className="fs-5">Vaše soukromí je pro nás důležité.</strong>
              <p className="mb-3 mb-md-0 me-md-4">
        Používáme Microsoft Clarity, abychom viděli, kolik sem chodí lidí a co tu hledají. K tomu potřebujeme uložit statistické cookies. Můžete je povolit, nebo to odmítnout (web bude fungovat úplně normálně tak i tak).
      </p>
            </div>
            <div className="d-flex gap-2 shrink-0">
              <Button variant="outline-light" size="sm" onClick={handleReject}>Odmítnout</Button>
              <Button variant="primary" size="sm" onClick={handleAccept}>Přijmout cookies</Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
