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
    notes: "",
    nextAction: "",
    nextActionDate: "",
    status: "PLANNED",
  });

  const formatDateForInput = (value?: string | Date) => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  };

  // 🔥 Meeting değiştiğinde formu resetle
  useEffect(() => {
    if (!meeting) return;

    setForm({
      subject: meeting.subject ?? "",
      notes: meeting.notes ?? "",
      nextAction: meeting.nextAction ?? "",
      nextActionDate: formatDateForInput(meeting.nextActionDate),
      status: meeting.status ?? "PLANNED",
    });
  }, [meeting]);

  if (!meeting) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Toplantıyı Düzenle</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Konu"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Notlar"
            multiline
            minRows={3}
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Sonraki Adım"
            value={form.nextAction}
            onChange={(e) =>
              setForm({ ...form, nextAction: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Sonraki Adım Tarihi"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.nextActionDate}
            onChange={(e) =>
              setForm({ ...form, nextActionDate: e.target.value })
            }
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
