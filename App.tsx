
import React, { useState, useMemo } from 'react';
import { ProjectState, ProjectBrief, Equipment, ComplianceStatus, DesignInputs } from './types';
import ProjectBriefForm from './components/ProjectBriefForm';
import EquipmentManager from './components/EquipmentManager';
import ComplianceTracker from './components/ComplianceTracker';
import ConsultancyReport from './components/ConsultancyReport';

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    brief: null,
    design: null,
    inventory: [],
    compliance: null
  });

  const [activeTab, setActiveTab] = useState<'setup' | 'boq' | 'analysis'>('setup');

  const updateBrief = (brief: ProjectBrief) => {
    const projectedTR = Math.round(brief.builtUpArea / 325);
    const projectedKW = Math.round(brief.builtUpArea * 0.085);
    
    setState(prev => ({ 
      ...prev, 
      brief: { ...brief },
      design: {
        cadReference: `ID-${brief.city.toUpperCase().slice(0,3)}-${Math.floor(1000 + Math.random()*8999)}`,
        mechanicalLayoutStatus: 'Completed',
        electricalLoadKW: projectedKW, 
        totalCoolingLoadTR: projectedTR, 
        designAssumptions: `Market Standard Baseline. Site: ${brief.city}.`
      }
    }));
  };

  const addEquipment = (item: Equipment) => {
    setState(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
  };

  const removeEquipment = (id: string) => {
    setState(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) }));
  };

  const updateCompliance = (compliance: ComplianceStatus) => {
    setState(prev => ({ ...prev, compliance }));
  };

  const projectCode = useMemo(() => {
    if (!state.brief?.clientName) return 'Project_Initial';
    return `ID_${state.brief.city.toUpperCase()}_${new Date().getFullYear()}`;
  }, [state.brief]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal Top Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#D2D2D7]/50 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">HVAC Consult-MIS</span>
            <span className="text-sm font-medium text-[#86868B]">Studio</span>
          </div>
          
          <nav className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-full">
            {[
              { id: 'setup', label: 'Brief' },
              { id: 'boq', label: 'Inventory' },
              { id: 'analysis', label: 'Analysis' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-[#86868B] hover:text-black'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        {activeTab === 'setup' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold tracking-tight mb-4">Set the baseline.</h1>
              <p className="text-xl text-[#86868B] font-medium">Capture mandatory consultancy data to begin analysis.</p>
            </div>
            <ProjectBriefForm data={state.brief} onSave={updateBrief} />
            
            {state.brief && (
              <div className="apple-card p-10 mt-12 flex flex-col md:flex-row items-center gap-10">
                <div className="text-4xl">📐</div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-xl font-bold tracking-tight">Engineering Baseline</h4>
                  <p className="text-lg text-[#86868B] leading-relaxed">
                    Based on <span className="text-black font-semibold">{state.brief.city}</span> parameters, 
                    the model projects a <span className="text-black font-semibold">{state.design?.totalCoolingLoadTR} TR</span> load 
                    with <span className="text-black font-semibold">{state.design?.electricalLoadKW} kW</span> peak power.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'boq' && (
          <div className="animate-fadeIn space-y-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">Build the BOQ.</h1>
              <p className="text-lg text-[#86868B]">Manually enter every component with OEM specifics.</p>
            </div>
            <EquipmentManager items={state.inventory} onAdd={addEquipment} onRemove={removeEquipment} />
            <ComplianceTracker data={state.compliance} onSave={updateCompliance} />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">Strategic Insights.</h1>
              <p className="text-lg text-[#86868B]">Consultancy-grade findings on cost and compliance.</p>
            </div>
            <ConsultancyReport state={state} />
          </div>
        )}
      </main>

      {/* Minimal Footer Status */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#D2D2D7]/50 py-3 px-8 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex gap-8 text-[11px] font-semibold text-[#86868B] uppercase tracking-widest">
                <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state.brief ? 'bg-green-500' : 'bg-[#D2D2D7]'}`}></div>
                    Brief
                </span>
                <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state.inventory.length > 0 ? 'bg-green-500' : 'bg-[#D2D2D7]'}`}></div>
                    Inventory
                </span>
                <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state.compliance ? 'bg-green-500' : 'bg-[#D2D2D7]'}`}></div>
                    Legal
                </span>
            </div>
            <div className="text-[11px] font-medium text-[#86868B]">
                {projectCode}
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
