import { useState, useEffect } from "react";
import { supabase } from "../../data/sources/supabase";

interface UserOrganization {
  id: string;
  name: string;
  slug: string;
}

export const useUserOrganization = (userId: string | undefined) => {
  const [organization, setOrganization] = useState<UserOrganization | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchOrganization = async () => {
      setIsLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("organization_id")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        if (userData?.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select("id, name, slug")
            .eq("id", userData.organization_id)
            .single();

          if (!orgError && orgData) {
            setOrganization(orgData);
          }
        }
      } catch (error) {
        console.error("Error fetching user organization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [userId]);

  return { organization, isLoading };
};
