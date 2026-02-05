import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAccount } from "../../api/account.api";
import type { AccountStatus } from "../../types/account";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCOUNT_STATUSES: AccountStatus[] = [
  "ACTIVE",
  "POTENTIAL",
  "DEMO",
  "PARTNER",
  "CONSULTANT",
  "SUPPLIER",
  "PASSIVE",
];

export default function CreateAccountDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    name: string;
    industry: string;
    status: AccountStatus;
  }>({
    name: "",
    industry: "",
    status: "ACTIVE",
  });

  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setForm({ name: "", industry: "", status: "ACTIVE" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Firma</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Firma Adı"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Sektör / Endüstri"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Firma Durumu"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            {ACCOUNT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={mutation.isPending || !form.name}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
