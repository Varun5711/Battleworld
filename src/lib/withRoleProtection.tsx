import LoaderUI from "@/components/shared/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { ComponentType } from "react";

export default function withRoleProtection<T extends object>(
  WrappedComponent: ComponentType<T>,
  allowedRoles: Array<"interviewer" | "candidate">
) {
  return function ProtectedComponent(props: T) {
    const { isLoading, role } = useUserRole();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && role && !allowedRoles.includes(role)) {
        router.push("/unauthorized");
      }
    }, [isLoading, role]);

    if (isLoading || (role && !allowedRoles.includes(role))) {
      return <LoaderUI />; // Or loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}