"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getToken, getRegistrationDraft } from "@/storage";

export const RegistrationRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only guard multi-step wizard pages after OTP
    if (!pathname || pathname === "/registration/otp") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Basic Info step is accessed with temporary regSessionToken (pre-Bearer token)
    if (pathname === "/registration/basic-info") {
      const regSessionToken =
        searchParams.get("regSessionToken") ||
        (typeof window !== "undefined" ? sessionStorage.getItem("sindhi_reg_session_token") : null) ||
        getRegistrationDraft()?.token;
      const draft = getRegistrationDraft();
      const mobile = searchParams.get("mobile") || draft?.phone || draft?.mobileNumber || "";

      if (regSessionToken || getToken()) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(false);
      setIsLoading(false);
      if (mobile) {
        router.replace(`/registration/otp?mobile=${encodeURIComponent(mobile)}`);
      } else {
        router.replace("/");
      }
      return;
    }

    const token = getToken() || searchParams.get("token") || getRegistrationDraft()?.token;
    const draft = getRegistrationDraft();
    const mobile = searchParams.get("mobile") || draft?.phone || draft?.mobileNumber || "";

    if (!token) {
      setIsAuthorized(false);
      setIsLoading(false);
      if (mobile) {
        router.replace(`/registration/otp?mobile=${encodeURIComponent(mobile)}`);
      } else {
        router.replace("/");
      }
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [pathname, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-stone-600 text-sm font-medium">Verifying registration session...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default RegistrationRouteGuard;
