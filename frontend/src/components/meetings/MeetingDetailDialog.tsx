import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import type { Meeting } from "../../types/meeting";
import { formatContactDisplay } from "../../utils/contact";

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Toplantı Detayı</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>
            <b>Firma:</b> {meeting.accountName ?? "-"}
          </Typography>
          <Typography>
            <b>İlgili Kişi:</b> {formatContactDisplay(meeting)}
          </Typography>
          <Typography>
            <b>Sorumlu Kişi:</b> {meeting.userName ?? "-"}
          </Typography>
          <Typography>
            <b>Konu:</b> {meeting.subject ?? "-"}
          </Typography>
          <Typography>
            <b>Tarih:</b> {meetingStart}
          </Typography>
          <Typography>
            <b>Durum:</b> {meeting.status ?? "-"}
          </Typography>
          <Typography
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            <b>Toplantı Notu:</b> {meeting.notes ?? "-"}
          </Typography>
          <div>
            <Typography variant="body1" fontWeight={700} mb={1}>
              Davetliler
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {meeting.attendees?.length ? (
                meeting.attendees.map((attendee) => (
                  <Chip
                    key={attendee.id ?? `${attendee.attendeeType}-${attendee.email}`}
                    label={attendee.email}
                    color={attendee.isPrimary ? "primary" : "default"}
                    variant={attendee.isPrimary ? "filled" : "outlined"}
                  />
                ))
              ) : (
                <Typography color="text.secondary">-</Typography>
              )}
            </Stack>
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}
