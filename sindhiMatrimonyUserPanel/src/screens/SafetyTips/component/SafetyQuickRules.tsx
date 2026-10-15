import React from "react";
import { AlertOctagon, MessageSquareLock, MapPin, Users2 } from "lucide-react";
import { QuickRule } from "../types";

interface SafetyQuickRulesProps {
  rules: readonly QuickRule[];
}

export const SafetyQuickRules: React.FC<SafetyQuickRulesProps> = React.memo(({ rules }) => {
  const getRuleIcon = (id: string) => {
    switch (id) {
      case "rule-no-money":
        return <AlertOctagon className="w-5 h-5 text-red-600" />;
      case "rule-chat-platform":
        return <MessageSquareLock className="w-5 h-5 text-amber-600" />;
      case "rule-public-meetings":
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      default:
        return <Users2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCardStyle = (type: QuickRule["type"]) => {
    switch (type) {
      case "danger":
        return "bg-red-50/70 border-red-200/90 hover:border-red-300";
      case "warning":
        return "bg-amber-50/70 border-amber-200/90 hover:border-amber-300";
      default:
        return "bg-emerald-50/60 border-emerald-200/90 hover:border-emerald-300";
    }
  };

  const getBadgeStyle = (type: QuickRule["type"]) => {
    switch (type) {
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <section aria-label="Essential Safety Golden Rules" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#DB2F3C]">
            Mandatory Precautions
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-heading">
            4 Golden Rules of Matrimonial Safety
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${getCardStyle(
              rule.type
            )}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200/60">
                  {getRuleIcon(rule.id)}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                    rule.type
                  )}`}
                >
                  {rule.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-heading mb-1.5">
                {rule.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

SafetyQuickRules.displayName = "SafetyQuickRules";
