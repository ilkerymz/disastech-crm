import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addProcessNote, getProcessNotes } from "../../api/process.api";
import type { Process } from "../../types/process";

interface Props {
  open: boolean;
  process: Process | null;
  onClose: () => void;
}

const trimNote = (value: string) => value.trim();

export default function ProcessNotesDialog({ open, process, onClose }: Props) {
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  const processId = process?.id ?? "";

  const { data: notes = [], isLoading, isError } = useQuery({
    queryKey: ["process-notes", processId],
    queryFn: () => getProcessNotes(processId),
    enabled: open && !!processId,
  });

  const addNoteMutation = useMutation({
    mutationFn: (payload: { note: string; isNegativeReason?: boolean }) =>
      addProcessNote(processId, payload),
    onSuccess: () => {
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["process-notes", processId] });
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
  });

  if (!process) {
    return null;
  }

  const handleAddNote = () => {
    if (process.salesStage === "NEGATIVE") {
      setBlockedMessage("Bu süreç olumsuz aşamada olduğu için yeni not eklenemez.");
      return;
    }

    const note = trimNote(newNote);
    if (!note) {
      return;
    }

    setBlockedMessage("");
    addNoteMutation.mutate({
      note,
      isNegativeReason: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{process.accountName} - Süreç Notları</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {blockedMessage ? (
            <Alert severity="warning" onClose={() => setBlockedMessage("")}>
              {blockedMessage}
            </Alert>
          ) : null}

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              label="Yeni not"
              placeholder="Sürece ilişkin not ekleyin..."
              value={newNote}
              onChange={(event) => {
                setNewNote(event.target.value);
                if (blockedMessage) {
                  setBlockedMessage("");
                }
              }}
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
              {notes.map((item, index) => {
                const isNegativeReason = Boolean(item.isNegativeReason);

                return (
                <Stack
                  key={item.id}
                  spacing={0.5}
                  sx={{
                    border: "1px solid",
                    borderColor: isNegativeReason ? "#fecaca" : "divider",
                    borderRadius: 1,
                    p: 1.25,
                    backgroundColor: isNegativeReason ? "#fef2f2" : undefined,
                  }}
                >
                  <Typography
                    variant="caption"
                    color={isNegativeReason ? "#b91c1c" : "text.secondary"}
                  >
                    {index + 1}.{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("tr-TR")
                      : "-"}
                    {item.createdByName ? ` - ${item.createdByName}` : ""}
                  </Typography>
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      color: isNegativeReason ? "#b91c1c" : "text.primary",
                      fontWeight: isNegativeReason ? 600 : 400,
                    }}
                  >
                    {item.note}
                  </Typography>
                </Stack>
                );
              })}
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
