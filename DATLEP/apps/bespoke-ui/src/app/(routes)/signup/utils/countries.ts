export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  color: string;
}

export const africanCountries: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phoneCode: '+234', color: '#008751' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', phoneCode: '+233', color: '#CE1126' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', phoneCode: '+254', color: '#000000' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phoneCode: '+27', color: '#000000' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', phoneCode: '+20', color: '#CE1126' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', phoneCode: '+251', color: '#DA121A' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phoneCode: '+255', color: '#1EB53A' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', phoneCode: '+225', color: '#F77F00' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', phoneCode: '+237', color: '#007A5E' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', phoneCode: '+221', color: '#00853F' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', phoneCode: '+256', color: '#FCDC04' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', phoneCode: '+213', color: '#006233' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', phoneCode: '+212', color: '#C1272D' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', phoneCode: '+244', color: '#C8102E' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', phoneCode: '+258', color: '#007168' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', phoneCode: '+263', color: '#006400' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', phoneCode: '+250', color: '#20603D' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', phoneCode: '+229', color: '#008751' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', phoneCode: '+226', color: '#EF2B2D' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', phoneCode: '+228', color: '#006A4E' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', phoneCode: '+223', color: '#CE1126' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', phoneCode: '+260', color: '#198A00' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', phoneCode: '+265', color: '#CE1126' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', phoneCode: '+227', color: '#0DB02B' },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', phoneCode: '+243', color: '#007FFF' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', phoneCode: '+249', color: '#D21034' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', phoneCode: '+241', color: '#009E60' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', phoneCode: '+232', color: '#1EB53A' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', phoneCode: '+231', color: '#BF0A30' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', phoneCode: '+224', color: '#CE1126' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', phoneCode: '+220', color: '#CE1126' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', phoneCode: '+238', color: '#003F87' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', phoneCode: '+222', color: '#006233' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', phoneCode: '+252', color: '#4189DD' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', phoneCode: '+291', color: '#EA0437' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', phoneCode: '+253', color: '#6AB2E7' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', phoneCode: '+257', color: '#1EB53A' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', phoneCode: '+240', color: '#3C8D53' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹', phoneCode: '+239', color: '#12AD2B' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', phoneCode: '+248', color: '#D62828' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', phoneCode: '+269', color: '#FF0000' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', phoneCode: '+230', color: '#EA2839' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', phoneCode: '+266', color: '#FFFFFF' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', phoneCode: '+267', color: '#75AADB' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', phoneCode: '+264', color: '#003580' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', phoneCode: '+268', color: '#3E5EB9' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return africanCountries.find(country => country.code === code);
};

export const getCountryByName = (name: string): Country | undefined => {
  return africanCountries.find(country => country.name === name);
};