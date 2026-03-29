import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContact } from "../../api/contact.api";
import type { Contact } from "../../types/contact";

interface Props {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export default function UpdateContactDialog({
  open,
  contact,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!contact) return;
    setForm({
      fullName: contact.fullName || "",
      title: contact.title || "",
      email: contact.email || "",
      phone: contact.phone || "",
    });
  }, [contact]);

  const mutation = useMutation({
    mutationFn: (payload: {
      id: string;
      fullName: string;
      title?: string;
      email?: string;
      phone?: string;
    }) => updateContact(payload.id, {
      fullName: payload.fullName,
      title: payload.title,
      email: payload.email,
      phone: payload.phone,
    }),
    onSuccess: () => {
      if (contact?.accountId) {
        queryClient.invalidateQueries({
          queryKey: ["contacts", contact.accountId],
        });
      }
      onClose();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!contact) return;
    mutation.mutate({
      id: contact.id,
      fullName: form.fullName,
      title: form.title || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Kişi Güncelle</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Ad Soyad"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="E-posta"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Ünvan"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={mutation.isPending || !form.fullName || !contact}
        >
          Güncelle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
