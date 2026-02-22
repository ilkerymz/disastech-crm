import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  deleteContact,
  getContactsByAccountAndActiveTrue,
} from "../../api/contact.api";
import type { Contact } from "../../types/contact";
import CreateContactDialog from "./CreateContactDialog";
import UpdateContactDialog from "./UpdateContactDialog";

interface Props {
  accountId: string;
}

export default function ContactList({ accountId }: Props) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts", accountId],
    queryFn: () => getContactsByAccountAndActiveTrue(accountId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", accountId],
      });
    },
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
              <Stack direction="row" spacing={1}>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => {
                    setSelectedContact(contact);
                    setEditOpen(true);
                  }}
                  aria-label="Kişiyi düzenle"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => deleteMutation.mutate(contact.id)}
                  disabled={deleteMutation.isPending}
                  aria-label="Kişiyi sil"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
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

      <UpdateContactDialog
        open={editOpen}
        contact={selectedContact}
        onClose={() => {
          setEditOpen(false);
          setSelectedContact(null);
        }}
      />
    </Stack>
  );
}
