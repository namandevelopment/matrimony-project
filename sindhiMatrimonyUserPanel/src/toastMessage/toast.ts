/**
 * Universal Premium Web Toast Notification
 * Sindhi Matrimony Application (Web / Next.js)
 *
 * Placed by default at TOP-RIGHT with smooth slide-in animations,
 * crisp vector icons, dismiss button, auto-hide progress, and zero React overhead.
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  type?: ToastType;
  message?: string;
  duration?: number;
  title?: string;
  position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
  text1?: string;
  text2?: string;
  text?: string;
  msg?: string;
  error?: string;
  onClose?: () => void;
  onPress?: () => void;
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
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

let isToastActive = false;

export const isAnyToastActive = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  const container = document.getElementById('web-toast-container');
  const hasVisibleDomToast = Boolean(container && container.children.length > 0);

  if (!hasVisibleDomToast) {
    (window as any).__IS_TOAST_ACTIVE__ = false;
    isToastActive = false;
    return false;
  }

  return Boolean((window as any).__IS_TOAST_ACTIVE__ || isToastActive || hasVisibleDomToast);
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

  // Single active toast guard: Do not allow another toast while one is already active
  if (isAnyToastActive()) {
    return;
  }
  isToastActive = true;
  if (typeof window !== 'undefined') {
    (window as any).__IS_TOAST_ACTIVE__ = true;
  }

  const accent = ACCENTS[type] || ACCENTS.info;
  const iconSvg = ICONS[type] || ICONS.info;

  const toastCard = document.createElement('div');
  toastCard.style.cssText = `
    position: relative !important;
    display: flex !important;
    align-items: flex-start !important;
    gap: 12px !important;
    padding: 14px 16px !important;
    background: ${accent.bg} !important;
    border: 1px solid ${accent.border} !important;
    border-radius: 14px !important;
    box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    overflow: hidden !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease !important;
    transform: translateX(120%) !important;
    opacity: 0 !important;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    box-sizing: border-box !important;
  `;

  // Left Icon
  const iconWrapper = document.createElement('div');
  iconWrapper.style.cssText = `
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 10px !important;
    background: ${accent.iconBg} !important;
    flex-shrink: 0 !important;
    margin-top: 1px !important;
  `;
  iconWrapper.innerHTML = iconSvg;

  // Middle Text Content
  const contentWrapper = document.createElement('div');
  contentWrapper.style.cssText = `
    flex: 1 1 auto !important;
    min-width: 0 !important;
    padding-right: 8px !important;
    display: flex !important;
    flex-direction: column !important;
  `;

  if (title) {
    const titleEl = document.createElement('div');
    titleEl.style.cssText = `
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #0F172A !important;
      margin-bottom: 2px !important;
      line-height: 1.3 !important;
    `;
    titleEl.textContent = title;
    contentWrapper.appendChild(titleEl);
  }

  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    font-size: 13.5px !important;
    line-height: 1.45 !important;
    font-weight: 500 !important;
    color: #1E293B !important;
    word-break: break-word !important;
    white-space: normal !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  `;
  messageEl.textContent = message;
  contentWrapper.appendChild(messageEl);

  // Right Close Button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.style.cssText = `
    background: transparent !important;
    border: none !important;
    padding: 6px !important;
    margin-left: auto !important;
    align-self: flex-start !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 8px !important;
    color: #94A3B8 !important;
    flex-shrink: 0 !important;
    transition: background 0.15s ease, color 0.15s ease !important;
  `;
  closeBtn.innerHTML = CLOSE_ICON;

  // Bottom Progress Bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    height: 3px !important;
    background: ${accent.bar} !important;
    width: 100% !important;
    transform-origin: left !important;
    transition: transform ${duration}ms linear !important;
  `;

  toastCard.appendChild(iconWrapper);
  toastCard.appendChild(contentWrapper);
  toastCard.appendChild(closeBtn);
  toastCard.appendChild(progressBar);

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
      isToastActive = false;
      if (typeof window !== 'undefined') {
        (window as any).__IS_TOAST_ACTIVE__ = false;
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
      closeBtn.style.color = '#1E293B';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = '#94A3B8';
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

export const hideToast = (): void => {
  isToastActive = false;
  if (typeof window !== 'undefined') {
    (window as any).__IS_TOAST_ACTIVE__ = false;
  }
  if (typeof document === 'undefined') return;
  const container = document.getElementById('web-toast-container');
  if (container) {
    container.innerHTML = '';
  }
};

let lastToastKey = '';
let lastToastTimestamp = 0;

export const showToast = (
  optionsOrMessage: ToastOptions | string,
  typeFallback: ToastType = 'info'
): void => {
  // Single active toast guard: If another toast is already visible on screen, do not allow a new one
  if (isAnyToastActive()) {
    return;
  }

  let message = '';
  let title = '';
  let type: ToastType = typeFallback;
  let duration: number | undefined;
  let onClose: (() => void) | undefined;
  let onPress: (() => void) | undefined;

  if (typeof optionsOrMessage === 'string') {
    message = optionsOrMessage.trim();
    type = typeFallback;
  } else if (optionsOrMessage && typeof optionsOrMessage === 'object') {
    const opts = optionsOrMessage as any;
    message = (
      opts.message ||
      opts.text2 ||
      opts.text ||
      opts.msg ||
      (typeof opts.error === 'string' ? opts.error : '') ||
      opts.text1 ||
      ''
    ).toString().trim();

    title = (opts.title || (opts.text1 && opts.text2 ? opts.text1 : '') || '').toString().trim();
    type = opts.type || typeFallback;
    duration = opts.duration;
    onClose = opts.onClose;
    onPress = opts.onPress;
  }

  // Guarantee non-empty message for error toasts
  if (!message) {
    if (title) {
      message = title;
      title = '';
    } else if (type === 'error') {
      message = 'An unexpected error occurred. Please try again.';
    } else {
      return;
    }
  }

  // Anti-duplicate spam prevention within 600ms
  const now = Date.now();
  const currentKey = `${type}:${message}:${title}`;
  if (currentKey === lastToastKey && now - lastToastTimestamp < 600) {
    return;
  }
  lastToastKey = currentKey;
  lastToastTimestamp = now;

  showBrowserToast(message, type, {
    duration: duration || (type === 'error' ? 3500 : 2500),
    title: title || undefined,
    onClose,
    onPress,
  });
};

export const toast = {
  show: (config: ToastOptions) => showToast(config),
  error: (message: string, options?: Partial<ToastOptions> | number): void => {
    if (typeof options === 'number') {
      showToast({ message, type: 'error', duration: options });
    } else {
      showToast({ message, type: 'error', duration: 3500, ...options });
    }
  },
  success: (message: string, options?: Partial<ToastOptions> | number): void => {
    if (typeof options === 'number') {
      showToast({ message, type: 'success', duration: options });
    } else {
      showToast({ message, type: 'success', duration: 2500, ...options });
    }
  },
  info: (message: string, options?: Partial<ToastOptions> | number): void => {
    if (typeof options === 'number') {
      showToast({ message, type: 'info', duration: options });
    } else {
      showToast({ message, type: 'info', duration: 2500, ...options });
    }
  },
  warning: (message: string, options?: Partial<ToastOptions> | number): void => {
    if (typeof options === 'number') {
      showToast({ message, type: 'warning', duration: options });
    } else {
      showToast({ message, type: 'warning', duration: 3000, ...options });
    }
  },
  hide: hideToast,
};

export default toast;
