import React, { useState } from 'react';

const SafetyInformation = () => {
  const [activeSection, setActiveSection] = useState('guidelines');

  const sections = {
    guidelines: {
      title: 'Gas Safety Guidelines',
      content: [
        {
          title: 'Daily Safety Checks',
          items: [
            'Check for gas smell before lighting stove',
            'Ensure proper ventilation in kitchen',
            'Turn off main valve when not in use',
            'Check rubber tube for cracks monthly'
          ]
        },
        {
          title: 'Appliance Safety',
          items: [
            'Use only ISI marked appliances',
            'Regular servicing every 6 months',
            'Keep flammable items away from stove',
            'Never leave cooking unattended'
          ]
        }
      ]
    },
    emergency: {
      title: 'Emergency Procedures',
      content: [
        {
          title: 'Gas Leak Detected',
          items: [
            'Do NOT switch on/off any electrical appliance',
            'Do NOT use mobile phone inside',
            'Open all doors and windows immediately',
            'Turn off main gas valve if accessible safely',
            'Evacuate all family members',
            'Call emergency helpline from outside',
            'Do NOT re-enter until cleared by officials'
          ],
          emergencyNumber: '1800-233-3555'
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-red-600">Safety Information</h2>
      
      <div className="flex border-b mb-6">
        {Object.keys(sections).map(key => (
          <button
            key={key}
            className={`mr-4 pb-2 font-medium capitalize ${activeSection === key ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-500'}`}
            onClick={() => setActiveSection(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold mb-6">{sections[activeSection].title}</h3>
        
        {sections[activeSection].content.map((block, i) => (
          <div key={i} className="mb-6 p-4 bg-gray-50 rounded">
            <h4 className="text-xl font-bold mb-3">{block.title}</h4>
            <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
            {block.emergencyNumber && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded font-bold text-center text-xl shadow-inner">
                Emergency Helpline: {block.emergencyNumber}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyInformation;
