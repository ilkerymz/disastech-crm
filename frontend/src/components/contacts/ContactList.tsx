import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getContactsByAccount } from "../../api/contact.api";
import type { Contact } from "../../types/contact";
import CreateContactDialog from "./CreateContactDialog";

interface Props {
  accountId: string;
}

export default function ContactList({ accountId }: Props) {
  const [open, setOpen] = useState(false);

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts", accountId],
    queryFn: () => getContactsByAccount(accountId),
  });

  return (
    <Stack spacing={1}>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Kişi Ekle
      </Button>

      <List dense>
        {contacts.map((contact) => (
          <ListItem
            key={contact.id}
            secondaryAction={
              <IconButton edge="end" size="small">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={contact.fullName}
              secondary={contact.email}
            />
          </ListItem>
        ))}
      </List>

      <CreateContactDialog
        open={open}
        onClose={() => setOpen(false)}
        accountId={accountId}
      />
    </Stack>
  );
}
