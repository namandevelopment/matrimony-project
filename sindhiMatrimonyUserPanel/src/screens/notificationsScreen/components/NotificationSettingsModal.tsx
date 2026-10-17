"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import { X, Bell, Mail, Smartphone, Check, RotateCcw } from "lucide-react";
import { NotificationPreferenceSetting } from "../types";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../staticData";

export interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (preferences: NotificationPreferenceSetting[]) => void;
}

const NotificationSettingsModalComponent: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferenceSetting[]>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggle = useCallback(
    (id: string, channel: "email" | "sms" | "push") => {
      setPreferences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [channel]: !item[channel] } : item
        )
      );
      setSavedSuccess(false);
    },
    []
  );

  const handleReset = useCallback(() => {
    setPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
    setSavedSuccess(false);
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(preferences);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  }, [onSave, preferences, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB2F3C] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-lg font-bold text-stone-900 tracking-tight"
              >
                Notification Preferences
              </h2>
              <p className="text-xs text-stone-500">
                Choose how and when you want to receive alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Channel Legend */}
          <div className="flex items-center justify-end gap-6 text-xs font-semibold text-stone-500 pb-2 border-b border-stone-100">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-stone-400" /> Push
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-stone-400" /> SMS
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" /> Email
            </span>
          </div>

          {/* Preferences list */}
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-stone-200 transition-all"
              >
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-semibold text-stone-900">
                    {pref.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {pref.description}
                  </p>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-5 sm:gap-6 shrink-0 self-end sm:self-auto">
                  {/* Push */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pref.push}
                      onChange={() => handleToggle(pref.id, "push")}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#DB2F3C]" />
                  </label>

                  {/* SMS */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pref.sms}
                      onChange={() => handleToggle(pref.id, "sms")}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#DB2F3C]" />
                  </label>

                  {/* Email */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      onChange={() => handleToggle(pref.id, "email")}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#DB2F3C]" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#DB2F3C] hover:bg-[#b71f2a] text-white transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationSettingsModal = memo(NotificationSettingsModalComponent);
NotificationSettingsModal.displayName = "NotificationSettingsModal";
export default NotificationSettingsModal;
