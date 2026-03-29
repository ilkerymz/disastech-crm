import type { Contact } from "../types/contact";
import type { Meeting } from "../types/meeting";

export const formatContactDisplay = (
  contact:
    | Pick<Contact, "fullName" | "title">
    | Pick<Meeting, "contactName" | "contactTitle">
    | null
    | undefined
) => {
  if (!contact) {
    return "-";
  }

  const isContact = "fullName" in contact;
  const name = isContact ? contact.fullName : contact.contactName;
  const title = isContact ? contact.title : contact.contactTitle;

  if (!name) {
    return "-";
  }

  return title ? `${name} • ${title}` : name;
};
