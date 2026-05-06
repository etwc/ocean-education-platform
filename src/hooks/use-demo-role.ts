"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isUserRole } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/domain";

export function useDemoRole(defaultRole: UserRole = "student") {
  const [role, setRoleState] = useState<UserRole>(defaultRole);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      const savedRole = window.localStorage.getItem("ocean-demo-role");

      if (isUserRole(savedRole)) {
        setRoleState(savedRole);
      }

      const supabase = createClient();
      const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
      const metadataRole = data.user?.user_metadata?.role ?? data.user?.app_metadata?.role;

      if (mounted && isUserRole(metadataRole)) {
        setRoleState(metadataRole);
        window.localStorage.setItem("ocean-demo-role", metadataRole);
      }

      if (mounted) {
        setIsReady(true);
      }
    }

    loadRole();

    return () => {
      mounted = false;
    };
  }, []);

  function setRole(nextRole: UserRole) {
    window.localStorage.setItem("ocean-demo-role", nextRole);
    setRoleState(nextRole);
  }

  return { role, setRole, isReady };
}
