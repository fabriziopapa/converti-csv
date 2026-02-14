type TabType = 'convertitore' | 'hrsuite';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Tab navigation per switch tra Convertitore e HRSuite
 */
export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const baseClasses = "px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 cursor-pointer";
  const activeClasses = "border-blue-600 text-blue-600";
  const inactiveClasses = "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300";

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {/* Tab Convertitore */}
          <button
            onClick={() => onTabChange('convertitore')}
            className={`${baseClasses} ${
              activeTab === 'convertitore' ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
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
            </div>
          </button>

          {/* Tab HRSuite */}
          <button
            onClick={() => onTabChange('hrsuite')}
            className={`${baseClasses} ${
              activeTab === 'hrsuite' ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
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
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

export type { TabType };
