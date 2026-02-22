import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { InvitePreview } from "../../api/meeting.api";

interface Props {
  open: boolean;
  preview: InvitePreview | null;
  onCancel: () => void;
  onConfirm: (description: string) => void;
}

export default function InvitePreviewDialog({
  open,
  preview,
  onCancel,
  onConfirm,
}: Props) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setDescription("");
    }
  }, [open]);

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
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>İptal</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(description)}
        >
          Maili Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
