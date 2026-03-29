import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getContactsByAccountAndActiveTrue } from "../../api/contact.api";
import { getAssignableUsers } from "../../api/user.api";
import type { AdminUser } from "../../api/admin.api";
import type { InvitePreview } from "../../api/meeting.api";
import type { Contact } from "../../types/contact";
import { formatContactDisplay } from "../../utils/contact";

interface Props {
  open: boolean;
  preview: InvitePreview | null;
  accountId?: string;
  primaryContactId?: string;
  ownerUserId?: string;
  onCancel: () => void;
  onConfirm: (payload: {
    description?: string;
    additionalContactIds: string[];
    additionalUserIds: string[];
    manualEmails: string[];
  }) => void;
}

const EMAIL_SEPARATOR_REGEX = /[\s,;]+/;

const normalizeManualEmails = (value: string) =>
  Array.from(
    new Set(
      value
        .split(EMAIL_SEPARATOR_REGEX)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );

const mergeManualEmails = (values: string[]) =>
  Array.from(
    new Set(
      values
        .flatMap((value) => normalizeManualEmails(value))
        .filter(Boolean)
    )
  );

export default function InvitePreviewDialog({
  open,
  preview,
  accountId,
  primaryContactId,
  ownerUserId,
  onCancel,
  onConfirm,
}: Props) {
  const [description, setDescription] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [manualEmails, setManualEmails] = useState<string[]>([]);
  const [manualEmailInput, setManualEmailInput] = useState("");

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["invite-contacts", accountId],
    queryFn: () => getContactsByAccountAndActiveTrue(accountId!),
    enabled: open && Boolean(accountId),
  });

  const { data: users = [] } = useQuery<AdminUser[]>({
    queryKey: ["assignable-users"],
    queryFn: getAssignableUsers,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setDescription("");
      setSelectedContacts([]);
      setSelectedUsers([]);
      setManualEmails([]);
      setManualEmailInput("");
    }
  }, [open]);

  const availableContacts = contacts.filter((contact) => contact.id !== primaryContactId);
  const availableUsers = users.filter((user) => user.id && user.id !== ownerUserId);
  const resolvedManualEmails = useMemo(
    () => mergeManualEmails([...manualEmails, manualEmailInput]),
    [manualEmailInput, manualEmails]
  );
  const recipientChips = useMemo(() => {
    const values = new Set(preview?.recipients ?? []);

    for (const contact of selectedContacts) {
      if (contact.email) {
        values.add(contact.email);
      }
    }

    for (const user of selectedUsers) {
      if (user.email && user.email !== "-") {
        values.add(user.email);
      }
    }

    for (const email of resolvedManualEmails) {
      values.add(email);
    }

    return Array.from(values);
  }, [preview?.recipients, resolvedManualEmails, selectedContacts, selectedUsers]);

  if (!preview) return null;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>📧 Davetiye Önizleme</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2">Alıcılar</Typography>
            <Box
              mt={1}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {recipientChips.map((r) => (
                <Chip key={r} label={r} />
              ))}
            </Box>
          </div>

          <div>
            <Typography variant="subtitle2">Konu</Typography>
            <Typography mt={1}>{preview.subject}</Typography>
          </div>

          <div>
            <Typography variant="subtitle2">İçerik</Typography>
            <Typography mt={1} whiteSpace="pre-line">
              {preview.description}
            </Typography>
          </div>

          <TextField
            label="Toplantı Açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ornek: Gorusmede teknik detaylar ve sonraki adimlar paylasilacaktir."
            helperText="Bu alan opsiyoneldir. Bos birakirsaniz maile eklenmez."
            multiline
            minRows={4}
            fullWidth
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={manualEmails}
            inputValue={manualEmailInput}
            onInputChange={(_, value, reason) => {
              if (reason === "reset") {
                setManualEmailInput("");
                return;
              }

              const normalized = normalizeManualEmails(value);
              if (normalized.length > 1 || /[;,]\s*$/.test(value)) {
                setManualEmails((prev) => mergeManualEmails([...prev, ...normalized]));
                setManualEmailInput("");
                return;
              }

              setManualEmailInput(value);
            }}
            onChange={(_, value) => {
              setManualEmails(mergeManualEmails(value));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                onBlur={() => {
                  setManualEmails((prev) => mergeManualEmails([...prev, manualEmailInput]));
                  setManualEmailInput("");
                }}
                label="Manuel E-posta"
                placeholder="ornek1@mail.com yazip Enter'a basin"
                helperText="Birden fazla e-posta ekleyebilirsiniz. Enter, virgul veya noktalı virgül ile ayırın."
                fullWidth
              />
            )}
          />

          <Autocomplete
            multiple
            options={availableContacts}
            value={selectedContacts}
            onChange={(_, value) => setSelectedContacts(value)}
            getOptionLabel={(option) => formatContactDisplay(option)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ek Contact Kişiler"
                helperText="Ana ilgili kişi dışında davete eklenecek contactları seçin."
              />
            )}
          />

          <Autocomplete
            multiple
            options={availableUsers}
            value={selectedUsers}
            onChange={(_, value) => setSelectedUsers(value)}
            getOptionLabel={(option) =>
              option.fullName === "-" ? option.email : `${option.fullName} • ${option.email}`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="İç Ekipten Ek Katılımcılar"
                helperText="Toplantı sahibine ek olarak davete eklenecek kullanıcıları seçin."
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>İptal</Button>
        <Button
          variant="contained"
          onClick={() =>
            onConfirm({
              description: description.trim() || undefined,
              additionalContactIds: selectedContacts.map((contact) => contact.id),
              additionalUserIds: selectedUsers.flatMap((user) => (user.id ? [user.id] : [])),
              manualEmails: resolvedManualEmails,
            })
          }
        >
          Maili Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
