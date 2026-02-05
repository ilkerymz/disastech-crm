import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAccounts } from "../../api/account.api";
import { getContactsByAccount } from "../../api/contact.api";
import { createMeeting } from "../../api/meeting.api";
import { getUserIdFromToken } from "../../auth/token";

import type { Account } from "../../types/account";
import type { Contact } from "../../types/contact";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateMeetingDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();

  // -----------------------------
  // STATE
  // -----------------------------
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [form, setForm] = useState({
    subject: "",
    date: "", // ⬅️ TEK TARİH
    notes: "",
  });

  // -----------------------------
  // QUERIES
  // -----------------------------
  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts", selectedAccount?.id],
    queryFn: () => getContactsByAccount(selectedAccount!.id),
    enabled: !!selectedAccount,
  });

  // -----------------------------
  // MUTATION
  // -----------------------------
  const mutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      onClose();
    },
  });

  // -----------------------------
  // HANDLER
  // -----------------------------
  const handleSubmit = () => {
    if (!selectedAccount || !form.date) return;

    const ownerUserId = getUserIdFromToken();
    if (!ownerUserId) return;

    // 🔑 TEK TARİHTEN TÜREV
    const start = `${form.date}T09:00`;
    const end = `${form.date}T10:00`;
    const nextActionDate = form.date;

    mutation.mutate({
      accountId: selectedAccount.id,
      contactId: selectedContact?.id,
      ownerUserId,
      subject: form.subject,
      notes: form.notes,
      start,
      end,
      nextActionDate,
    });
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Toplantı</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* FİRMA */}
          <Autocomplete
            options={accounts}
            getOptionLabel={(option) => option.name}
            value={selectedAccount}
            onChange={(_, value) => {
              setSelectedAccount(value);
              setSelectedContact(null);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Firma" />
            )}
          />

          {/* İLGİLİ KİŞİ */}
          <Autocomplete
            options={contacts}
            getOptionLabel={(option) => option.fullName}
            value={selectedContact}
            onChange={(_, value) => setSelectedContact(value)}
            disabled={!selectedAccount}
            renderInput={(params) => (
              <TextField {...params} label="İlgili Kişi" />
            )}
          />

          {/* KONU */}
          <TextField
            label="Konu"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            fullWidth
          />

          {/* NOTLAR */}
<TextField
  label="Notlar"
  value={form.notes}
  onChange={(e) =>
    setForm({ ...form, notes: e.target.value })
  }
  fullWidth
  multiline
  minRows={4}
  placeholder="Toplantı ile ilgili notlar..."
/>


          {/* TEK TARİH */}
          <TextField
            label="Tarih"
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            mutation.isPending ||
            !selectedAccount ||
            !form.date ||
            !getUserIdFromToken()
          }
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
