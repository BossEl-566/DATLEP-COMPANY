// utils/daysOfWeek.ts (Simpler version)

export interface DayOfWeek {
  id: string;
  label: string;
  shortLabel: string;
  abbreviation: string;
}

export const daysOfWeek: DayOfWeek[] = [
  { id: 'monday', label: 'Monday', shortLabel: 'Mon', abbreviation: 'M' },
  { id: 'tuesday', label: 'Tuesday', shortLabel: 'Tue', abbreviation: 'T' },
  { id: 'wednesday', label: 'Wednesday', shortLabel: 'Wed', abbreviation: 'W' },
  { id: 'thursday', label: 'Thursday', shortLabel: 'Thu', abbreviation: 'Th' },
  { id: 'friday', label: 'Friday', shortLabel: 'Fri', abbreviation: 'F' },
  { id: 'saturday', label: 'Saturday', shortLabel: 'Sat', abbreviation: 'Sa' },
  { id: 'sunday', label: 'Sunday', shortLabel: 'Sun', abbreviation: 'Su' }
];

// Helper to get day by ID
export const getDayById = (id: string): DayOfWeek | undefined => {
  return daysOfWeek.find(day => day.id === id);
};

// Get weekdays only
export const weekdays = daysOfWeek.filter(day => 
  !['saturday', 'sunday'].includes(day.id)
);

// Get weekends only
export const weekends = daysOfWeek.filter(day => 
  ['saturday', 'sunday'].includes(day.id)
);

// Format days for display
export const formatDays = (dayIds: string[]): string => {
  if (dayIds.length === 0) return 'None';
  if (dayIds.length === 7) return 'Every day';
  
  const dayLabels = dayIds.map(id => {
    const day = getDayById(id);
    return day?.shortLabel || id;
  });
  
  return dayLabels.join(', ');
};