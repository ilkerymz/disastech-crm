import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

import type { InvitePreview } from "../../api/meeting.api";

interface Props {
  open: boolean;
  preview: InvitePreview | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function InvitePreviewDialog({
  open,
  preview,
  onCancel,
  onConfirm,
}: Props) {
  if (!preview) return null;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>📧 Davetiye Önizleme</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2">Alıcılar</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
              {preview.recipients.map((r) => (
                <Chip key={r} label={r} />
              ))}
            </Stack>
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
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>İptal</Button>
        <Button variant="contained" onClick={onConfirm}>
          Maili Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
