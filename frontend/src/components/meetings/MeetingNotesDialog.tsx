import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import { addMeetingNote, getMeetingNotes } from "../../api/meeting.api";
import type { Meeting } from "../../types/meeting";

interface Props {
  open: boolean;
  meeting: Meeting | null;
  onClose: () => void;
}

const trimNote = (value: string) => value.trim();
const normalizeNotes = (value: unknown) => {
  if (Array.isArray(value)) return value;
  if (
    value &&
    typeof value === "object" &&
    "content" in value &&
    Array.isArray((value as { content: unknown[] }).content)
  ) {
    return (value as { content: unknown[] }).content;
  }
  return [];
};

export default function MeetingNotesDialog({ open, meeting, onClose }: Props) {
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");

  const meetingId = meeting ? String(meeting.id) : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meeting-notes", meetingId],
    queryFn: () => getMeetingNotes(meetingId),
    enabled: open && !!meetingId,
  });
  const notes = normalizeNotes(data);

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addMeetingNote(meetingId, note),
    onSuccess: () => {
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["meeting-notes", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  if (!meeting) return null;

  const handleAddNote = () => {
    const note = trimNote(newNote);
    if (!note) return;
    addNoteMutation.mutate(note);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Toplantı Notları</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              label="Hızlı not"
              placeholder="Not ekleyin..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <Button
              variant="contained"
              onClick={handleAddNote}
              disabled={addNoteMutation.isPending || !trimNote(newNote)}
            >
              Not Ekle
            </Button>
          </Stack>

          <Divider />

          {isLoading ? (
            <Typography>Yükleniyor...</Typography>
          ) : isError ? (
            <Typography color="error.main">
              Notlar alınırken hata oluştu.
            </Typography>
          ) : notes.length === 0 ? (
            <Typography color="text.secondary">Henüz not yok.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {notes.map((item, index) => (
                <Stack
                  key={item.id}
                  spacing={0.5}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1.25,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {index + 1}.{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("tr-TR")
                      : "-"}
                    {item.createdByName ? ` - ${item.createdByName}` : ""}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {item.note}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
}
