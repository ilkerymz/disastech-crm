import {
  Alert,
  Autocomplete,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "../../api/account.api";
import type { Account, AccountStatus } from "../../types/account";
import {
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusLabel,
} from "../../constants/accountStatus";
import { getAssignableUsers } from "../../api/user.api";
import type { AdminUser } from "../../api/admin.api";

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
  const { data: users = [], isLoading: usersLoading, isError: usersError } =
    useQuery<AdminUser[]>({
      queryKey: ["assignable-users"],
      queryFn: getAssignableUsers,
    });

  const [form, setForm] = useState<{
    industry: string;
    phone: string;
    email: string;
    status: AccountStatus;
    responsibleUser: AdminUser | null;
  }>({
    industry: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    responsibleUser: null,
  });

  useEffect(() => {
    if (!account) return;
    setForm({
      industry: account.industry || "",
      phone: account.phone || "",
      email: account.email || "",
      status: account.status || "ACTIVE",
      responsibleUser:
        account.responsibleUserId && account.responsibleUserName
          ? {
              id: account.responsibleUserId,
              fullName: account.responsibleUserName,
              email: "",
              role: "",
            }
          : null,
    });
  }, [account]);

  const mutation = useMutation({
    mutationFn: (payload: {
      id: string;
      industry?: string;
      phone?: string;
      email?: string;
      status: AccountStatus;
      responsibleUserId?: string;
    }) =>
      updateAccount(payload.id, {
        industry: payload.industry,
        phone: payload.phone,
        email: payload.email,
        status: payload.status,
        responsibleUserId: payload.responsibleUserId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["processes"] });
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
      phone: form.phone || undefined,
      email: form.email || undefined,
      status: form.status,
      responsibleUserId: form.responsibleUser?.id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Firma Güncelle</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {usersError && (
            <Alert severity="warning">
              Sorumlu kişi listesi alınamadı. Backend tarafında kullanıcı seçim endpointi gerekir.
            </Alert>
          )}

          <TextField
            label="Sektör / Endüstri"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="E-posta"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <Autocomplete
            options={users}
            loading={usersLoading}
            value={form.responsibleUser}
            onChange={(_, value) =>
              setForm((prev) => ({
                ...prev,
                responsibleUser: value,
              }))
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.fullName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sorumlu Kişi"
                placeholder="Bir kullanıcı seçin"
              />
            )}
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
          disabled={mutation.isPending || !account || !form.responsibleUser?.id}
        >
          Güncelle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
