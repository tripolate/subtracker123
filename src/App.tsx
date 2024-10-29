import React from 'react';
import { BellRing, CreditCard, Settings, User } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">SubTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <BellRing className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Monthly Spending</h3>
            <p className="mt-2 text-3xl font-semibold text-indigo-600">$127.84</p>
            <p className="mt-1 text-sm text-gray-500">Across 8 subscriptions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Trials</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">3</p>
            <p className="mt-1 text-sm text-gray-500">Ending soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Renewals</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">2</p>
            <p className="mt-1 text-sm text-gray-500">Next 7 days</p>
          </div>
        </div>

        {/* Subscription List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Subscriptions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              {
                name: 'Netflix',
                price: 15.99,
                renewalDate: '2024-04-15',
                category: 'Entertainment'
              },
              {
                name: 'Spotify',
                price: 9.99,
                renewalDate: '2024-04-10',
                category: 'Music'
              },
              {
                name: 'Adobe Creative Cloud',
                price: 52.99,
                renewalDate: '2024-04-20',
                category: 'Productivity'
              }
            ].map((subscription, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{subscription.name}</h3>
                    <p className="text-sm text-gray-500">Renews {subscription.renewalDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${subscription.price}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {subscription.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;