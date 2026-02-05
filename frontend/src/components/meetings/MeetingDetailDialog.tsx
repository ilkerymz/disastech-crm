import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import type { Meeting } from "../../types/meeting";

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

  const nextActionDate = meeting.nextActionDate
    ? new Date(meeting.nextActionDate).toLocaleString("tr-TR")
    : "-";

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
            <b>Tarih:</b> {nextActionDate}
          </Typography>
          <Typography
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            <b>Notlar:</b> {meeting.notes ?? "-"}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}
