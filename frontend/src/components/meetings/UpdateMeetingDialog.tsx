import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Box,
} from "@mui/material";

import type {
  LossReason,
  Meeting,
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
  const formatDateTimeForInput = (value?: string) => {
    if (!value) return "";
    if (value.includes("T")) {
      return value.slice(0, 16);
    }
    return value;
  };

  const [form, setForm] = useState({
    subject: "",
    start: "",
    end: "",
    nextAction: "",
    salesStatus: "PROGRESSING" as SalesStatus,
    salesStage: "FIRST_MEETING" as SalesStage,
    offerAmount: "",
    lastMeetingDate: "",
    lossReason: "" as LossReason | "",
    status: "PLANNED",
  });

  // 🔥 Meeting değiştiğinde formu resetle
  useEffect(() => {
    if (!meeting) return;

    setForm({
      subject: meeting.subject ?? "",
      start: formatDateTimeForInput(meeting.start),
      end: formatDateTimeForInput(meeting.end),
      nextAction: meeting.nextAction ?? "",
      salesStatus: meeting.salesStatus ?? "PROGRESSING",
      salesStage: meeting.salesStage ?? "FIRST_MEETING",
      offerAmount:
        meeting.offerAmount === undefined || meeting.offerAmount === null
          ? ""
          : String(meeting.offerAmount),
      lastMeetingDate: meeting.lastMeetingDate ?? "",
      lossReason: meeting.lossReason ?? "",
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
            label="Başlangıç"
            type="datetime-local"
            value={form.start}
            onChange={(e) =>
              setForm({ ...form, start: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Bitiş"
            type="datetime-local"
            value={form.end}
            onChange={(e) =>
              setForm({ ...form, end: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
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

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={() =>
            onSave({
              ...form,
              start: form.start || undefined,
              end: form.end || undefined,
              offerAmount:
                form.offerAmount === "" ? undefined : Number(form.offerAmount),
              lastMeetingDate: form.lastMeetingDate || undefined,
              lossReason: form.lossReason || undefined,
            })
          }
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
