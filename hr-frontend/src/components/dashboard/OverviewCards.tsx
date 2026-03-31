import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  LogOut,
  ClockPlus,
  FileWarning,
  AlertCircle,
} from "lucide-react";

interface OverviewCardsProps {
  stats: any[];
}

const OverviewCards = ({ stats }: OverviewCardsProps) => {
  // ฟังก์ชันช่วยเลือก Icon ตามชื่อ string
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case "Users":
        return <Users {...iconProps} />;
      case "UserCheck":
        return <UserCheck {...iconProps} />;
      case "LogOut":
        return <LogOut {...iconProps} />;
      case "ClockPlus":
        return <ClockPlus {...iconProps} />;
      case "FileWarning":
        return <FileWarning {...iconProps} />;
      case "AlertCircle":
        return <AlertCircle {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  return (
    <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {stats.map((stat: any) => (
        <Card
          key={stat.label}
          className="shadow-sm border-2 border-slate-300 hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex gap-3 items-start justify-between">
              <div className="min-w-0">
                <p className="text-base font-medium text-slate-500 leading-tight h-8 line-clamp-2">
                  {stat.label}
                </p>
                <p className="text-xl font-bold mt-1 text-slate-900 truncate">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className="self-center">
                <div
                  className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  {renderIcon(stat.icon)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;
