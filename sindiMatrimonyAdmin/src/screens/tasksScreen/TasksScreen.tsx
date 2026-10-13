import React, { useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Search,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { FollowUpTask, TaskType, LeadPriority } from '../../types/crm.types';
import { PageHeader } from '../../components/PageHeader';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { toast } from '../../toastMessage/toast';
import { useInputs } from '../../customHooks/useInputs';

export interface TasksScreenState {
  tasks: FollowUpTask[];
  filterStatus: string;
  search: string;
  isNewTaskModalOpen: boolean;
  formSubmitted: boolean;
}

export interface TaskFormValues {
  clientId: string;
  taskType: TaskType;
  dueDate: string;
  dueTime: string;
  priority: LeadPriority;
  assignedEmployeeId: string;
  notes: string;
}

export const TasksScreen: React.FC = () => {
  const {
    values: uiState,
    setFieldValue: setUiFieldValue,
    setValues: setUiValues,
  } = useInputs<TasksScreenState>(() => ({
    tasks: crmDataService.getTasks(),
    filterStatus: 'ALL',
    search: '',
    isNewTaskModalOpen: false,
    formSubmitted: false,
  }));

  const { tasks, filterStatus, search, isNewTaskModalOpen, formSubmitted } = uiState;

  const {
    values: form,
    setFieldValue: setFormFieldValue,
    errors: formErrors,
    touched: formTouched,
    bind: formBind,
    validateForm: validateTaskForm,
    reset: resetTaskForm,
  } = useInputs<TaskFormValues>(
    {
      clientId: 'SIND001',
      taskType: 'CALL',
      dueDate: '2025-10-14',
      dueTime: '11:30 AM',
      priority: 'HIGH',
      assignedEmployeeId: 'emp_003',
      notes: 'Follow up on matrimonial profile approval and family meeting schedule.',
    },
    {
      validate: (v) => {
        const errs: Partial<Record<keyof TaskFormValues, string>> = {};
        if (!v.dueDate) {
          errs.dueDate = 'Due date is required';
        }
        if (!v.dueTime.trim()) {
          errs.dueTime = 'Due time is required';
        }
        if (!v.notes.trim()) {
          errs.notes = 'Task notes are required';
        } else if (v.notes.trim().length < 5) {
          errs.notes = 'Notes must be at least 5 characters';
        }
        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const refresh = () => {
    setUiFieldValue('tasks', crmDataService.getTasks());
  };

  useEffect(() => {
    refresh();
    return crmDataService.subscribe(refresh);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'PENDING' && t.status !== 'PENDING' && t.status !== 'DUE_TODAY') return false;
    if (filterStatus === 'OVERDUE' && t.status !== 'OVERDUE') return false;
    if (filterStatus === 'COMPLETED' && t.status !== 'COMPLETED') return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        t.clientName.toLowerCase().includes(q) ||
        t.taskId.toLowerCase().includes(q) ||
        t.assignedEmployeeName.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTaskFieldError = (field: keyof TaskFormValues) => {
    return formTouched[field] || formSubmitted ? formErrors[field] : undefined;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setUiFieldValue('formSubmitted', true);

    if (!validateTaskForm()) {
      const firstErr = formErrors.dueDate || formErrors.dueTime || formErrors.notes;
      if (firstErr) {
        toast.warning(firstErr);
      }
      return;
    }

    const clients = crmDataService.getClients();
    const client = clients.find((c) => c.clientId === form.clientId) || clients[0];
    const employees = crmDataService.getEmployees();
    const emp = employees.find((e) => e.id === form.assignedEmployeeId) || employees[0];

    crmDataService.addTask({
      clientId: client ? client.clientId : 'SIND001',
      clientName: client ? client.fullName : 'Roshni Motwani',
      taskType: form.taskType,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority,
      status: 'PENDING',
      assignedEmployeeId: emp.id,
      assignedEmployeeName: emp.fullName,
      notes: form.notes.trim(),
    });

    setUiValues({
      isNewTaskModalOpen: false,
      formSubmitted: false,
    });
    resetTaskForm();
    toast.success(`Task scheduled successfully for ${client ? client.fullName : 'Client'}!`);
  };

  const handleMarkComplete = (taskId: string) => {
    crmDataService.updateTaskStatus(taskId, 'COMPLETED', 'Task finished successfully by coordinator');
    toast.success(`Task ${taskId} marked as completed!`);
  };

  const overdueCount = tasks.filter((t) => t.status === 'OVERDUE').length;
  const pendingCount = tasks.filter((t) => t.status === 'PENDING' || t.status === 'DUE_TODAY').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Tasks & Follow-ups Management"
        description="Monitor staff SLA deadlines, schedule matrimonial follow-ups, and track overdue client action items."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            SLA Task Engine
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active / Pending</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{pendingCount}</div>
          <span className="text-[11px] text-slate-400">Due for staff handling</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Overdue SLA Target</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{overdueCount}</div>
          <span className="text-[11px] text-rose-600 font-bold">Needs immediate escalation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Completed Follow-ups</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Resolved on time</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Follow-ups</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{tasks.length}</div>
          <span className="text-[11px] text-slate-400">Lifecycle actions logged</span>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUiFieldValue('filterStatus', 'ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterStatus === 'ALL' ? 'bg-[#88131B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setUiFieldValue('filterStatus', 'PENDING')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterStatus === 'PENDING' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setUiFieldValue('filterStatus', 'OVERDUE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterStatus === 'OVERDUE' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setUiFieldValue('filterStatus', 'COMPLETED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterStatus === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-64">
            <CustomTextInput
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setUiFieldValue('search', e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              clearable={true}
              onClear={() => setUiFieldValue('search', '')}
              size="sm"
            />
          </div>

          <button
            onClick={() => {
              setUiValues({
                formSubmitted: false,
                isNewTaskModalOpen: true,
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-3">Task ID</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Due Deadline</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.taskId}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{t.clientName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {t.taskType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    <div>{t.dueDate}</div>
                    <div className="text-[10px] text-slate-400">{t.dueTime}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{t.assignedEmployeeName}</td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{t.notes}</td>
                  <td className="py-3 px-3 text-right">
                    {t.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => handleMarkComplete(t.taskId)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition border border-emerald-200 cursor-pointer"
                      >
                        Complete
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Schedule Follow-up Task
              </h3>
              <button
                onClick={() => setUiFieldValue('isNewTaskModalOpen', false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} noValidate className="space-y-4 mt-4 text-xs">
              <CustomDropDown
                label="Target Client"
                value={form.clientId}
                onChange={(val) => setFormFieldValue('clientId', String(val))}
                options={crmDataService.getClients().map((c) => ({
                  value: c.clientId,
                  label: `${c.fullName} (${c.clientId})`,
                }))}
                size="sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <CustomDropDown
                  label="Type"
                  value={form.taskType}
                  onChange={(val) => setFormFieldValue('taskType', val as TaskType)}
                  options={[
                    { value: 'CALL', label: 'Call Follow-up' },
                    { value: 'PROFILE_SHARE', label: 'Profile Share' },
                    { value: 'MEETING', label: 'Video Meeting' },
                    { value: 'PAYMENT_FOLLOWUP', label: 'Payment Follow-up' },
                  ]}
                  size="sm"
                />
                <CustomDropDown
                  label="Priority"
                  value={form.priority}
                  onChange={(val) => setFormFieldValue('priority', val as LeadPriority)}
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'URGENT', label: 'Urgent' },
                  ]}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomTextInput
                  label="Due Date"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setFormFieldValue('dueDate', e.target.value)}
                  error={getTaskFieldError('dueDate')}
                  size="sm"
                />
                <CustomTextInput
                  label="Due Time"
                  type="text"
                  value={form.dueTime}
                  onChange={(e) => setFormFieldValue('dueTime', e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  error={getTaskFieldError('dueTime')}
                  size="sm"
                />
              </div>

              <CustomDropDown
                label="Assigned Employee"
                value={form.assignedEmployeeId}
                onChange={(val) => setFormFieldValue('assignedEmployeeId', String(val))}
                options={crmDataService.getEmployees().map((emp) => ({
                  value: emp.id,
                  label: `${emp.fullName} (${emp.employeeId}) — ${emp.role}`,
                }))}
                size="sm"
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions / Notes</label>
                <textarea
                  rows={2}
                  {...formBind('notes')}
                  placeholder="Task instructions..."
                  className={`w-full p-2.5 rounded-xl border font-medium ${
                    getTaskFieldError('notes') ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {getTaskFieldError('notes') && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{getTaskFieldError('notes')}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setUiFieldValue('isNewTaskModalOpen', false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
