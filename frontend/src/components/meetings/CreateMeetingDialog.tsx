import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
  MenuItem,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getActiveAccounts } from "../../api/account.api";
import { getContactsByAccountAndActiveTrue } from "../../api/contact.api";
import { createMeeting } from "../../api/meeting.api";
import { getUserIdFromToken } from "../../auth/token";

import type { Account } from "../../types/account";
import type { Contact } from "../../types/contact";
import type {
  LossReason,
  SalesStage,
  SalesStatus,
} from "../../types/meeting";
import {
  SALES_STATUS_OPTIONS,
  SALES_STATUS_COLORS,
  getSalesStatusLabel,
} from "../../constants/salesStatus";
import {
  SALES_STAGE_OPTIONS,
  getSalesStageLabel,
} from "../../constants/salesStage";
import {
  LOSS_REASON_OPTIONS,
  getLossReasonLabel,
} from "../../constants/lossReason";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateMeetingDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();

  const toLocalDateTimestamp = (value: string): number | null => {
    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (!match) return null;

    const [, year, month, day, hour, minute, second] = match;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? 0),
      0
    );

    if (Number.isNaN(date.getTime())) return null;
    return date.getTime();
  };

  // -----------------------------
  // STATE
  // -----------------------------
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [form, setForm] = useState({
    subject: "",
    start: "",
    end: "",
    salesStatus: "PROGRESSING" as SalesStatus,
    salesStage: "FIRST_MEETING" as SalesStage,
    offerAmount: "",
    lastMeetingDate: "",
    lossReason: "" as LossReason | "",
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

    const startTimestamp = toLocalDateTimestamp(form.start);
    const endTimestamp = toLocalDateTimestamp(form.end);
    if (startTimestamp === null || endTimestamp === null) {
      return;
    }
    if (endTimestamp <= startTimestamp) return;

    const start = form.start;
    const end = form.end;

    mutation.mutate({
      accountId: selectedAccount.id,
      contactId: selectedContact?.id,
      ownerUserId,
      subject: form.subject,
      start,
      end,
      salesStatus: form.salesStatus,
      salesStage: form.salesStage,
      offerAmount:
        form.offerAmount === "" ? undefined : Number(form.offerAmount),
      lastMeetingDate: form.lastMeetingDate || undefined,
      lossReason: form.lossReason || undefined,
    });
  };

  const startTimestamp = form.start ? toLocalDateTimestamp(form.start) : null;
  const endTimestamp = form.end ? toLocalDateTimestamp(form.end) : null;
  const hasInvalidTimeRange =
    startTimestamp === null ||
    endTimestamp === null ||
    endTimestamp <= startTimestamp;

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
            select
            label="Satış Durumu"
            value={form.salesStatus}
            onChange={(e) =>
              setForm({ ...form, salesStatus: e.target.value as SalesStatus })
            }
            SelectProps={{
              renderValue: (value) => {
                const status = value as SalesStatus;
                return (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: SALES_STATUS_COLORS[status],
                        border: "1px solid #1f1f1f",
                      }}
                    />
                    <span>{getSalesStatusLabel(status)}</span>
                  </Stack>
                );
              },
            }}
            fullWidth
          >
            {SALES_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: SALES_STATUS_COLORS[status],
                      border: "1px solid #1f1f1f",
                    }}
                  />
                  <span>{getSalesStatusLabel(status)}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Satış Aşaması"
            value={form.salesStage}
            onChange={(e) =>
              setForm({ ...form, salesStage: e.target.value as SalesStage })
            }
            fullWidth
          >
            {SALES_STAGE_OPTIONS.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {getSalesStageLabel(stage)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Teklif Tutarı (₺)"
            type="number"
            value={form.offerAmount}
            onChange={(e) =>
              setForm({ ...form, offerAmount: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Son Toplantı"
            type="date"
            value={form.lastMeetingDate}
            onChange={(e) =>
              setForm({ ...form, lastMeetingDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            select
            label="Kaybedilme Nedeni"
            value={form.lossReason}
            onChange={(e) =>
              setForm({ ...form, lossReason: e.target.value as LossReason | "" })
            }
            fullWidth
          >
            <MenuItem value="">-</MenuItem>
            {LOSS_REASON_OPTIONS.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {getLossReasonLabel(reason)}
              </MenuItem>
            ))}
          </TextField>

          {/* BAŞLANGIÇ */}
          <TextField
            label="Başlangıç"
            type="datetime-local"
            value={form.start}
            onChange={(e) =>
              setForm({ ...form, start: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          {/* BİTİŞ */}
          <TextField
            label="Bitiş"
            type="datetime-local"
            value={form.end}
            onChange={(e) =>
              setForm({ ...form, end: e.target.value })
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
            !form.start ||
            !form.end ||
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
