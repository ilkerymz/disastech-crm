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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';

import { getActiveAccounts } from "../../api/account.api";
import { getContactsByAccountAndActiveTrue } from "../../api/contact.api";
import { createMeeting } from "../../api/meeting.api";
import { getUserIdFromToken } from "../../auth/token";

import type { Account } from "../../types/account";
import type { Contact } from "../../types/contact";
import { formatContactDisplay } from "../../utils/contact";

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
    start: null as Dayjs | null,
    end: null as Dayjs | null,
    notes: "",
  });

  // -----------------------------
  // QUERIES
  // -----------------------------
  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: getActiveAccounts,
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts", selectedAccount?.id],
    queryFn: () => getContactsByAccountAndActiveTrue(selectedAccount!.id),
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
    if (!selectedAccount || !form.start || !form.end) return;

    const ownerUserId = getUserIdFromToken();
    if (!ownerUserId) return;

    // Zaman kontrolü
    if (form.end.isBefore(form.start) || form.end.isSame(form.start)) {
      return;
    }

    // Dayjs objelerini ISO string'e çevir
    const start = form.start.format('YYYY-MM-DDTHH:mm:ss');
    const end = form.end.format('YYYY-MM-DDTHH:mm:ss');

    mutation.mutate({
      accountId: selectedAccount.id,
      contactId: selectedContact?.id,
      ownerUserId,
      subject: form.subject,
      start,
      end,
      notes: form.notes.trim() || undefined,
    });
  };

  const hasInvalidTimeRange =
    !form.start ||
    !form.end ||
    form.end.isBefore(form.start) ||
    form.end.isSame(form.start);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Toplantı</DialogTitle>

      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
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
              getOptionLabel={(option) => formatContactDisplay(option)}
              value={selectedContact}
              onChange={(_, value) => setSelectedContact(value)}
              disabled={!selectedAccount}
              isOptionEqualToValue={(option, value) => option.id === value.id}
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

            <TextField
              label="Toplantı Notu"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              fullWidth
              multiline
              minRows={3}
            />

            {/* BAŞLANGIÇ */}
            <DateTimePicker
              label="Başlangıç"
              value={form.start}
              onChange={(newValue) =>
                setForm({ ...form, start: newValue })
              }
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                }
              }}
            />

            {/* BİTİŞ */}
            <DateTimePicker
              label="Bitiş"
              value={form.end}
              onChange={(newValue) =>
                setForm({ ...form, end: newValue })
              }
              ampm={false}
              minDateTime={form.start || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                }
              }}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            mutation.isPending ||
            !selectedAccount ||
            hasInvalidTimeRange ||
            !getUserIdFromToken()
          }
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
