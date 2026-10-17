/**
 * Universal Premium Web Toast Notification
 * Sindhi Matrimony Application (Web / Next.js)
 *
 * Placed by default at TOP-RIGHT with smooth slide-in animations,
 * crisp vector icons, dismiss button, auto-hide progress, and zero React overhead.
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  title?: string;
  onClose?: () => void;
}

const ICONS: Record<ToastType, string> = {
  success: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `,
  error: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `,
  warning: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  `,
  info: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `,
};

const ACCENTS: Record<ToastType, { bg: string; border: string; bar: string; iconBg: string }> = {
  success: {
    bg: '#FFFFFF',
    border: '#E2E8F0',
    bar: '#10B981',
    iconBg: '#ECFDF5',
  },
  error: {
    bg: '#FFFFFF',
    border: '#FEE2E2',
    bar: '#EF4444',
    iconBg: '#FEF2F2',
  },
  warning: {
    bg: '#FFFFFF',
    border: '#FEF3C7',
    bar: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  info: {
    bg: '#FFFFFF',
    border: '#DBEAFE',
    bar: '#3B82F6',
    iconBg: '#EFF6FF',
  },
};

const CLOSE_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
`;

const getOrCreateContainer = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;

  let container = document.getElementById('web-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'web-toast-container';
    container.setAttribute('aria-live', 'polite');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      width: calc(100vw - 32px);
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  return container;
};

const showBrowserToast = (
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions | number
): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (type === 'error') console.error(`[Toast Error] ${message}`);
    else console.log(`[Toast ${type}] ${message}`);
    return;
  }

  const duration = typeof options === 'number' ? options : options?.duration ?? 3500;
  const title = typeof options === 'object' ? options?.title : undefined;
  const onCloseCallback = typeof options === 'object' ? options?.onClose : undefined;

  const container = getOrCreateContainer();
  if (!container) return;

  const accent = ACCENTS[type] || ACCENTS.info;
  const iconSvg = ICONS[type] || ICONS.info;

  const toastCard = document.createElement('div');
  toastCard.style.cssText = `
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: ${accent.bg};
    border: 1px solid ${accent.border};
    border-radius: 14px;
    box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    pointer-events: auto;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
    transform: translateX(120%);
    opacity: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  toastCard.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: ${accent.iconBg};
      flex-shrink: 0;
      margin-top: 1px;
    ">
      ${iconSvg}
    </div>
    <div style="flex: 1; min-width: 0; padding-right: 4px;">
      ${title ? `<div style="font-size: 13px; font-weight: 600; color: #1E293B; margin-bottom: 2px;">${title}</div>` : ''}
      <div style="font-size: 13.5px; line-height: 1.45; font-weight: 500; color: #334155; word-break: break-word;">
        ${message}
      </div>
    </div>
    <button type="button" aria-label="Close" style="
      background: transparent;
      border: none;
      padding: 4px;
      margin: -2px -4px 0 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.15s ease;
    ">
      ${CLOSE_ICON}
    </button>
    <div style="
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: ${accent.bar};
      width: 100%;
      transform-origin: left;
      transition: transform ${duration}ms linear;
    "></div>
  `;

  const closeBtn = toastCard.querySelector('button');
  const progressBar = toastCard.querySelector('div:last-child') as HTMLElement;

  let isDismissed = false;
  let dismissTimeout: NodeJS.Timeout | null = null;

  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;

    if (dismissTimeout) clearTimeout(dismissTimeout);

    toastCard.style.transform = 'translateX(120%)';
    toastCard.style.opacity = '0';

    setTimeout(() => {
      if (toastCard.parentNode) {
        toastCard.parentNode.removeChild(toastCard);
      }
      if (onCloseCallback) {
        try {
          onCloseCallback();
        } catch {}
      }
    }, 350);
  };

  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#F1F5F9';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'transparent';
    });
  }

  // Click toast to dismiss
  toastCard.addEventListener('click', () => {
    dismiss();
  });

  // Pause on hover
  toastCard.addEventListener('mouseenter', () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
  });

  toastCard.addEventListener('mouseleave', () => {
    if (!isDismissed) {
      dismissTimeout = setTimeout(dismiss, 1200);
    }
  });

  container.appendChild(toastCard);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    toastCard.style.transform = 'translateX(0)';
    toastCard.style.opacity = '1';
    if (progressBar) {
      requestAnimationFrame(() => {
        progressBar.style.transform = 'scaleX(0)';
      });
    }
  });

  dismissTimeout = setTimeout(dismiss, duration);
};

export const toast = {
  error: (message: string, options?: ToastOptions | number): void =>
    showBrowserToast(message, 'error', options),
  success: (message: string, options?: ToastOptions | number): void =>
    showBrowserToast(message, 'success', options),
  info: (message: string, options?: ToastOptions | number): void =>
    showBrowserToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions | number): void =>
    showBrowserToast(message, 'warning', options),
};

export default toast;
