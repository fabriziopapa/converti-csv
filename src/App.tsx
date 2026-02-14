import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { TabNavigation } from './components/Layout/TabNavigation';
import { Footer } from './components/Layout/Footer';
import { ConvertitoreForm } from './components/Convertitore/ConvertitoreForm';
import { HRSuiteForm } from './components/HRSuite/HRSuiteForm';
import type { TabType } from './components/Layout/TabNavigation';

/**
 * App Root Component
 *
 * Struttura:
 * - Header
 * - Tab Navigation (Convertitore / HRSuite)
 * - Main Content (conditional rendering based on active tab)
 * - Footer
 */
function App() {
  const [activeTab, setActiveTab] = useState<TabType>('convertitore');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === 'convertitore' ? (
          <ConvertitoreForm />
        ) : (
          <HRSuiteForm />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
