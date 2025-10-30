'use client';

import { 
  BarChart3, 
  Circle, 
  Package, 
  Syringe, 
  Shield, 
  DollarSign,
  Settings
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    totalAnimais: number;
    custoMedioPorAnimal: number;
  };
}

export default function Navigation({ activeTab, setActiveTab, stats }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'rebanho', label: 'Rebanho', icon: Circle },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'manejo', label: 'Manejo Sanitário', icon: Shield },
    { id: 'custos', label: 'Custos', icon: DollarSign },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Logo da Fazenda Paiva */}
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/03128b5d-9370-42fd-80f7-363ffac8f546.jpg" 
                alt="Fazenda Paiva Logo" 
                className="h-10 w-auto rounded-md shadow-sm"
              />
              <div className="border-l border-gray-300 h-8 mx-2"></div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Circle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Rebanho Manager</h1>
            </div>
            <div className="text-sm text-gray-500">
              {stats.totalAnimais} animais • R$ {stats.custoMedioPorAnimal.toFixed(2)}/animal
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}