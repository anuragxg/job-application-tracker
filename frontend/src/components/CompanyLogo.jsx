import { useState } from 'react';

// Guesses the company's domain from its name (e.g. "Amazon" -> "amazon.com")
// and fetches the logo from Clearbit's free, no-key-needed logo API.
// Falls back to a colored circle with the company's first letter if the
// logo doesn't exist or fails to load (works for most well-known companies,
// less reliably for obscure or local ones).
function guessDomain(company) {
  return company.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
}

// Deterministic color per company name, so the same company always gets the
// same fallback color instead of a random one on every render.
function colorFromName(name) {
  const colors = ['#4a47a3', '#2f5d50', '#a56800', '#2952cc', '#c92a2a', '#1a7a3a'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function CompanyLogo({ company, size = 28 }) {
  const [failed, setFailed] = useState(false);

  if (!company) return null;

  if (failed) {
    return (
      <div
        className="company-logo-fallback"
        style={{ width: size, height: size, background: colorFromName(company), fontSize: size * 0.45 }}
      >
        {company.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      className="company-logo"
      src={`https://logo.clearbit.com/${guessDomain(company)}`}
      alt={`${company} logo`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

export default CompanyLogo;
