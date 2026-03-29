import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact } from "../../api/contact.api";

interface Props {
  open: boolean;
  onClose: () => void;
  accountId: string;
}

export default function CreateContactDialog({
  open,
  onClose,
  accountId,
}: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
  });

  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", accountId],
      });
      onClose();
      setForm({ fullName: "", title: "", email: "", phone: "" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate({
      accountId,
      fullName: form.fullName,
      title: form.title || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Kişi</DialogTitle>

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
          disabled={mutation.isPending || !form.fullName}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
