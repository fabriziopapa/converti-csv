import Container from 'react-bootstrap/Container';

/**
 * Header dell'applicazione con titolo
 */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-bottom">
      <Container className="py-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h2 fw-bold text-dark mb-1">
              Convertitore CSV
            </h1>
            <p className="text-muted small mb-0">
              Genera file per Agenzia delle Entrate e HRSuite
            </p>
          </div>

          {/* Logo/Icon opzionale */}
          <div className="d-none d-md-block">
            <div className="bg-primary bg-opacity-10 rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <svg
                className="text-primary"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
