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

  // -----------------------------
  // STATE
  // -----------------------------
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [form, setForm] = useState({
    subject: "",
    start: null as Dayjs | null,
    end: null as Dayjs | null,
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
      salesStatus: form.salesStatus,
      salesStage: form.salesStage,
      offerAmount:
        form.offerAmount === "" ? undefined : Number(form.offerAmount),
      lastMeetingDate: form.lastMeetingDate || undefined,
      lossReason: form.lossReason || undefined,
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

            {/* SATIŞ DURUMU */}
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

            {/* SATIŞ AŞAMASI */}
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

            {/* TEKLİF TUTARI */}
            <TextField
              label="Teklif Tutarı (₺)"
              type="number"
              value={form.offerAmount}
              onChange={(e) =>
                setForm({ ...form, offerAmount: e.target.value })
              }
              fullWidth
            />

            {/* SON TOPLANTI */}
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

            {/* KAYBEDİLME NEDENİ */}
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
