import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

// Common IANA timezones organized by region
const TIMEZONE_GROUPS = [
  {
    region: 'Africa',
    zones: [
      'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi'
    ]
  },
  {
    region: 'America',
    zones: [
      'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/New_York',
      'America/Phoenix', 'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
      'America/Argentina/Buenos_Aires', 'America/Sao_Paulo', 'America/Caracas'
    ]
  },
  {
    region: 'Asia',
    zones: [
      'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
      'Asia/Seoul', 'Asia/Kuala_Lumpur', 'Asia/Singapore', 'Asia/Bangkok',
      'Asia/Hong_Kong', 'Asia/Taipei', 'Asia/Jakarta', 'Asia/Manila'
    ]
  },
  {
    region: 'Europe',
    zones: [
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
      'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Warsaw',
      'Europe/Moscow', 'Europe/Athens', 'Europe/Istanbul'
    ]
  },
  {
    region: 'Pacific',
    zones: [
      'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Guam', 'Pacific/Honolulu'
    ]
  },
  {
    region: 'UTC',
    zones: [
      'UTC'
    ]
  }
];

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent>
        {TIMEZONE_GROUPS.map((group) => (
          <div key={group.region}>
            <div className="text-xs font-medium text-gray-500 px-2 py-1">
              {group.region}
            </div>
            {group.zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}