import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

type TabType = 'convertitore' | 'hrsuite' | 'epura';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Tab navigation per switch tra Convertitore, HRSuite e Epura
 */
export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="bg-white border-bottom">
      <Container>
        <Nav variant="tabs" className="border-0">
          {/* Tab Convertitore */}
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'convertitore'}
              onClick={() => onTabChange('convertitore')}
              className="px-4 py-3 d-flex align-items-center gap-2"
              style={{
                cursor: 'pointer',
                borderBottomWidth: '2px',
                borderBottomColor: activeTab === 'convertitore' ? 'var(--bs-primary)' : 'transparent'
              }}
            >
              <svg
                width="16"
                height="16"
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
              <span>Convertitore CSV</span>
            </Nav.Link>
          </Nav.Item>

          {/* Tab HRSuite */}
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'hrsuite'}
              onClick={() => onTabChange('hrsuite')}
              className="px-4 py-3 d-flex align-items-center gap-2"
              style={{
                cursor: 'pointer',
                borderBottomWidth: '2px',
                borderBottomColor: activeTab === 'hrsuite' ? 'var(--bs-primary)' : 'transparent'
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>HRSuite</span>
            </Nav.Link>
          </Nav.Item>

          {/* Tab Epura */}
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'epura'}
              onClick={() => onTabChange('epura')}
              className="px-4 py-3 d-flex align-items-center gap-2"
              style={{
                cursor: 'pointer',
                borderBottomWidth: '2px',
                borderBottomColor: activeTab === 'epura' ? 'var(--bs-primary)' : 'transparent'
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Epura CSV</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </nav>
  );
}

export type { TabType };
