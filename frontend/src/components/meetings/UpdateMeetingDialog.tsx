import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';

import type { Meeting } from "../../types/meeting";

interface Props {
  open: boolean;
  meeting: Meeting | null;
  onClose: () => void;
  onSave: (updated: Partial<Meeting>) => void;
}

export default function UpdateMeetingDialog({
  open,
  meeting,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    subject: "",
    start: null as Dayjs | null,
    end: null as Dayjs | null,
    notes: "",
    status: "PLANNED",
  });

  // 🔥 Meeting değiştiğinde formu resetle
  useEffect(() => {
    if (!meeting) return;

    setForm({
      subject: meeting.subject ?? "",
      start: meeting.start ? dayjs(meeting.start) : null,
      end: meeting.end ? dayjs(meeting.end) : null,
      notes: meeting.notes ?? "",
      status: meeting.status ?? "PLANNED",
    });
  }, [meeting]);

  const hasInvalidTimeRange = Boolean(
    form.start &&
      form.end &&
      (form.end.isBefore(form.start) || form.end.isSame(form.start))
  );

  const handleSave = () => {
    if (hasInvalidTimeRange) return;

    onSave({
      ...form,
      start: form.start ? form.start.format('YYYY-MM-DDTHH:mm:ss') : undefined,
      end: form.end ? form.end.format('YYYY-MM-DDTHH:mm:ss') : undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  if (!meeting) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Toplantıyı Düzenle</DialogTitle>

      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <Stack spacing={2} mt={1}>
            {/* KONU */}
            <TextField
              label="Konu"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              fullWidth
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
                }
              }}
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

          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={hasInvalidTimeRange}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
