import { useState, useCallback } from "react";
import { contactService } from "../../data/services/contactService";
import { UserService } from "../../data/services/UserService";
import type { Contact } from "../../core/entities/supabase/Contact";

type CreateContactInput = Omit<
  Contact,
  "id" | "created_at" | "updated_at" | "status" | "notes"
>;

const userService = new UserService();

export const useContacts = (organizationId?: string) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<
    { id: string; email: string; first_name: string; last_name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!organizationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [contactsData, usersData] = await Promise.all([
        contactService.getContacts(organizationId),
        userService.getUsers(organizationId),
      ]);
      setContacts(contactsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching contacts");
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  const createContact = useCallback(async (contact: CreateContactInput) => {
    try {
      const newContact = await contactService.createContact(contact);
      setContacts((prev) => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating contact");
      throw err;
    }
  }, []);

  const updateContact = useCallback(
    async (
      id: string,
      contact: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>,
    ) => {
      try {
        const updatedContact = await contactService.updateContact(id, contact);
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? updatedContact : c)),
        );
        return updatedContact;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error updating contact");
        throw err;
      }
    },
    [],
  );

  const softDeleteContact = useCallback(async (id: string, reason?: string) => {
    try {
      await contactService.softDeleteContact(id, reason);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting contact");
      throw err;
    }
  }, []);

  return {
    contacts,
    users,
    isLoading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    softDeleteContact,
  };
};
