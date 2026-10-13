import React from 'react';
import { Download, Sparkles, ArrowRightLeft, UserCheck } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { CustomButton } from '../../../components/CustomButton';

interface LeadsPageHeaderProps {
  isSuperAdmin: boolean;
  selectedCount: number;
  hasAssignedSelected: boolean;
  onSelectFirst20Unassigned: () => void;
  onOpenReassignBatch: () => void;
  onOpenAssignBatch: () => void;
  onExportCSV: () => void;
}

export const LeadsPageHeader: React.FC<LeadsPageHeaderProps> = React.memo(
  ({
    isSuperAdmin,
    selectedCount,
    hasAssignedSelected,
    onSelectFirst20Unassigned,
    onOpenReassignBatch,
    onOpenAssignBatch,
    onExportCSV,
  }) => {
    return (
      <PageHeader
        title={isSuperAdmin ? 'CRM Leads & Website Inquiries Queue' : 'My Assigned Leads & Follow-ups'}
        description={
          isSuperAdmin
            ? 'Capture website visitor inquiries, batch-assign without artificial limits, and reassign stalled leads to new employees with permanent audit logs.'
            : 'Review customer details, click-to-call, and log every user conversation response directly to the lead profile.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick 20 Unassigned Batch Button - Super Admin only */}
            {isSuperAdmin && (
              <CustomButton
                variant="outline"
                size="md"
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                onClick={onSelectFirst20Unassigned}
                className="border-amber-300 hover:bg-amber-50 text-amber-900"
              >
                Select 20 Unassigned
              </CustomButton>
            )}

            {/* Reassign Button - Super Admin only */}
            {isSuperAdmin && hasAssignedSelected && (
              <CustomButton
                variant="primary"
                size="md"
                icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                onClick={onOpenReassignBatch}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Reassign Selected ({selectedCount})
              </CustomButton>
            )}

            {/* Standard Assign Button - Super Admin only */}
            {isSuperAdmin && selectedCount > 0 && !hasAssignedSelected && (
              <CustomButton
                variant="primary"
                size="md"
                icon={<UserCheck className="w-3.5 h-3.5" />}
                onClick={onOpenAssignBatch}
                className="bg-gradient-to-r from-[#DB2F3C] to-amber-600"
              >
                Assign Leads ({selectedCount})
              </CustomButton>
            )}

            <CustomButton
              variant="outline"
              size="md"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={onExportCSV}
            >
              Export CSV
            </CustomButton>
          </div>
        }
      />
    );
  }
);

LeadsPageHeader.displayName = 'LeadsPageHeader';
