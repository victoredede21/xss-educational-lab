import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  footer?: ReactNode;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  footer
}: StatCardProps) => {
  return (
    <Card className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <span className={`material-icons p-3 ${iconBgColor} ${iconColor} rounded-lg`}>{icon}</span>
      </div>
      {footer && (
        <div className="mt-4 text-xs font-medium">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
