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

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "../../api/account.api";
import type { Account, AccountStatus } from "../../types/account";
import {
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusLabel,
} from "../../constants/accountStatus";

interface Props {
  open: boolean;
  account: Account | null;
  onClose: () => void;
}

export default function UpdateAccountDialog({
  open,
  account,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    industry: string;
    status: AccountStatus;
  }>({
    industry: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!account) return;
    setForm({
      industry: account.industry || "",
      status: account.status || "ACTIVE",
    });
  }, [account]);

  const mutation = useMutation({
    mutationFn: (payload: {
      id: string;
      industry?: string;
      status: AccountStatus;
    }) =>
      updateAccount(payload.id, {
        industry: payload.industry,
        status: payload.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!account) return;
    mutation.mutate({
      id: account.id,
      industry: form.industry || undefined,
      status: form.status,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Firma Güncelle</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
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
            {ACCOUNT_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {getAccountStatusLabel(status)}
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
          disabled={mutation.isPending || !account}
        >
          Güncelle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
