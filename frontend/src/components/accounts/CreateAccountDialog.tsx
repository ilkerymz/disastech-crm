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

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createAccount } from "../../api/account.api";
import { getAssignableUsers } from "../../api/user.api";
import type { AccountStatus } from "../../types/account";
import {
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusLabel,
} from "../../constants/accountStatus";
import type { AdminUser } from "../../api/admin.api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateAccountDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading: usersLoading, isError: usersError } =
    useQuery<AdminUser[]>({
      queryKey: ["assignable-users"],
      queryFn: getAssignableUsers,
    });

  const [form, setForm] = useState<{
    name: string;
    industry: string;
    phone: string;
    email: string;
    status: AccountStatus;
    responsibleUser: AdminUser | null;
  }>({
    name: "",
    industry: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    responsibleUser: null,
  });

  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["processes"] });
      onClose();
      setForm({
        name: "",
        industry: "",
        phone: "",
        email: "",
        status: "ACTIVE",
        responsibleUser: null,
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate({
      name: form.name,
      industry: form.industry || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      status: form.status,
      responsibleUserId: form.responsibleUser?.id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Firma</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {usersError && (
            <Alert severity="warning">
              Sorumlu kişi listesi alınamadı. Backend tarafında kullanıcı seçim endpointi gerekir.
            </Alert>
          )}

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
          disabled={mutation.isPending || !form.name || !form.responsibleUser?.id}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
