import React from 'react';
import { IMAGES } from '../../../components/image';

export const LoginBrandHero: React.FC = () => {
  return (
    <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-screen overflow-hidden bg-slate-900 shrink-0">
      <img
        src={IMAGES.adminLogin || IMAGES.loginMobile}
        alt="Sindhi Matrimony Wedding Couple"
        className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-slate-950/30 pointer-events-none" />

      <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50">
        <img
          src={IMAGES.logo}
          alt="Sindhi Matrimony Logo"
          className="h-10 w-auto object-contain"
        />
        <div>
          <div className="text-xs font-black tracking-wider text-rose-700 uppercase leading-none">
            Sindhi Matrimony
          </div>
          <div className="text-[10px] font-semibold text-amber-600 tracking-widest uppercase mt-0.5">
            Portal Admin
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-8 left-8 right-8 text-white z-10">
        <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
          Connecting Sindhi Hearts Worldwide
        </h2>
        <p className="text-xs text-slate-200 mt-1 max-w-md drop-shadow-sm">
          Centralized operations command for profiles, lead CRM, telephony calling, subscriptions, and verifications.
        </p>
      </div>
    </div>
  );
};

export default LoginBrandHero;
