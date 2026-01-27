// bespoke/components/ConsultationHours.tsx
import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { ConsultationHour } from '../types/bespoke';

interface ConsultationHoursProps {
  hours: ConsultationHour[];
  onChange: (hours: ConsultationHour[]) => void;
  days: Array<{ id: string; label: string }>;
}

const ConsultationHours: React.FC<ConsultationHoursProps> = ({ 
  hours, 
  onChange, 
  days 
}) => {
  const updateHours = (dayId: string, updates: Partial<ConsultationHour>) => {
    const updated = hours.map(hour => 
      hour.day === dayId ? { ...hour, ...updates } : hour
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const dayHours = hours.find(h => h.day === day.id) || {
          day: day.id,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: false
        };

        return (
          <div key={day.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={dayHours.isAvailable}
                onChange={(e) => updateHours(day.id, { isAvailable: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">{day.label}</span>
            </div>
            {dayHours.isAvailable ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <input
                    type="time"
                    value={dayHours.startTime}
                    onChange={(e) => updateHours(day.id, { startTime: e.target.value })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <input
                    type="time"
                    value={dayHours.endTime}
                    onChange={(e) => updateHours(day.id, { endTime: e.target.value })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-500 italic">Not available</span>
            )}
          </div>
        );
      })}

      <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
        <div>
          <p className="text-sm text-gray-700">Virtual consultations available outside business hours</p>
          <p className="text-xs text-gray-500">You can schedule video calls at mutually convenient times</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationHours;