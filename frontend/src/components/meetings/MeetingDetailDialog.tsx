import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import type { Meeting } from "../../types/meeting";
import {
  SALES_STATUS_COLORS,
  getSalesStatusLabel,
} from "../../constants/salesStatus";
import { getSalesStageLabel } from "../../constants/salesStage";
import { getLossReasonLabel } from "../../constants/lossReason";

interface Props {
  open: boolean;
  meeting: Meeting | null;
  onClose: () => void;
}

export default function MeetingDetailDialog({
  open,
  meeting,
  onClose,
}: Props) {
  if (!meeting) return null;

  const meetingStart = meeting.start
    ? new Date(meeting.start).toLocaleString("tr-TR")
    : "-";
  const lastMeetingDate = meeting.lastMeetingDate
    ? new Date(meeting.lastMeetingDate).toLocaleDateString("tr-TR")
    : "-";
  const offerAmount =
    meeting.offerAmount === undefined || meeting.offerAmount === null
      ? "-"
      : `${new Intl.NumberFormat("tr-TR").format(meeting.offerAmount)} ₺`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Toplantı Detayı</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>
            <b>Konu:</b> {meeting.subject ?? "-"}
          </Typography>
          <Typography>
            <b>Sonraki Adım:</b> {meeting.nextAction ?? "-"}
          </Typography>
          <Typography>
            <b>Satış Durumu:</b>
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {meeting.salesStatus ? (
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: SALES_STATUS_COLORS[meeting.salesStatus],
                  border: "1px solid #1f1f1f",
                }}
              />
            ) : null}
            <Typography>{getSalesStatusLabel(meeting.salesStatus)}</Typography>
          </Stack>
          <Typography>
            <b>Satış Aşaması:</b> {getSalesStageLabel(meeting.salesStage)}
          </Typography>
          <Typography>
            <b>Teklif Tutarı (₺):</b> {offerAmount}
          </Typography>
          <Typography>
            <b>Son Toplantı:</b> {lastMeetingDate}
          </Typography>
          <Typography>
            <b>Kaybedilme Nedeni:</b> {getLossReasonLabel(meeting.lossReason)}
          </Typography>
          <Typography>
            <b>Tarih:</b> {meetingStart}
          </Typography>
          <Typography
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            <b>Son Not:</b> {meeting.latestNote ?? meeting.notes ?? "-"}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}
