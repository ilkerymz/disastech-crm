import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type AdminUser,
} from "../../api/admin.api";

const DEFAULT_ROLE = "USER";
const ROLE_OPTIONS = ["USER", "ADMIN"];
const SUPER_ADMIN_EMAIL = (import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "")
  .trim()
  .toLowerCase();
const COMPANY_EMAIL_DOMAIN = "@disastechnology.com";

const getApiErrorMessage = (err: unknown) => {
  if (isAxiosError(err)) {
    console.error("Create user request failed:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
    });

    const data = err.response?.data as
      | string
      | { message?: string; error?: string }
      | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (typeof data === "object" && data !== null) {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    if (err.response?.status === 403) return "Bu işlem için super admin yetkisi gerekiyor.";
  }

  console.error("Create user request failed with unknown error:", err);
  return "Kullanıcı oluşturulamadı. Bilgileri kontrol edip tekrar deneyin.";
};

export default function AdminUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState(DEFAULT_ROLE);
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [actionsUser, setActionsUser] = useState<AdminUser | null>(null);
  const queryClient = useQueryClient();
  const normalizedEmail = email.trim().toLowerCase();
  const isExternalEmail =
    normalizedEmail.length > 0 && !normalizedEmail.endsWith(COMPANY_EMAIL_DOMAIN);
  const normalizedEditEmail = editEmail.trim().toLowerCase();
  const isExternalEditEmail =
    normalizedEditEmail.length > 0 &&
    !normalizedEditEmail.endsWith(COMPANY_EMAIL_DOMAIN);

  const isSuperAdminRow = (user: AdminUser) =>
    !!SUPER_ADMIN_EMAIL && user.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch,
    isFetching,
  } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (message) => {
      setSuccess(message || "User Created");
      setError(null);
      setFullName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setRole(DEFAULT_ROLE);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      setSuccess(null);
      setError(getApiErrorMessage(err));
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, payload),
    onSuccess: (message) => {
      setSuccess(message || "Kullanıcı güncellendi.");
      setError(null);
      setEditOpen(false);
      setSelectedUser(null);
      setEditPassword("");
      setEditPasswordConfirm("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      setSuccess(null);
      setError(getApiErrorMessage(err));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (message) => {
      setSuccess(message || "Kullanıcı silindi.");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      setSuccess(null);
      setError(getApiErrorMessage(err));
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirm) {
      setError("Şifre ve şifre tekrarı aynı olmalı.");
      return;
    }

    createUserMutation.mutate({ fullName, email, password, role });
  };

  const handleOpenEdit = (user: AdminUser) => {
    if (!user.id) {
      setSuccess(null);
      setError("Düzenleme için kullanıcı id alanı gerekiyor.");
      return;
    }

    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword("");
    setEditPasswordConfirm("");
    setError(null);
    setSuccess(null);
    setEditOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser?.id) {
      setError("Kullanıcı id bulunamadı.");
      return;
    }

    if (editPassword.trim() || editPasswordConfirm.trim()) {
      if (editPassword !== editPasswordConfirm) {
        setError("Yeni şifre ve şifre tekrarı aynı olmalı.");
        return;
      }
    }

    const payload: Parameters<typeof updateUser>[1] = {
      fullName: editFullName,
      email: editEmail,
      role: editRole,
    };

    if (editPassword.trim()) payload.password = editPassword;

    setError(null);
    setSuccess(null);
    updateUserMutation.mutate({ id: selectedUser.id, payload });
  };

  const handleDelete = (user: AdminUser) => {
    if (!user.id) {
      setSuccess(null);
      setError("Silme için kullanıcı id alanı gerekiyor.");
      return;
    }

    const confirmed = window.confirm(
      `${user.fullName || user.email} kullanıcısını silmek istediğine emin misin?`
    );
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    deleteUserMutation.mutate(user.id);
  };

  const handleOpenActions = (
    event: React.MouseEvent<HTMLElement>,
    user: AdminUser
  ) => {
    setActionsAnchorEl(event.currentTarget);
    setActionsUser(user);
  };

  const handleCloseActions = () => {
    setActionsAnchorEl(null);
    setActionsUser(null);
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Admin
      </Typography>

      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(244,247,244,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid #dce5dc",
          borderRadius: 4,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            mb: 1.5,
            color: "#5f6f65",
            fontWeight: 700,
            letterSpacing: 0.9,
          }}
        >
          Kullanıcı Yönetimi
        </Typography>

        <Box display="grid" gridTemplateColumns={{ xs: "1fr", lg: "1.2fr 1fr" }} gap={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 12px 32px rgba(22, 42, 31, 0.06)",
            }}
            elevation={0}
          >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Çalışanlar</Typography>
            <IconButton
              aria-label="yenile"
              size="small"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>

          {isUsersLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={28} />
            </Box>
          ) : isUsersError ? (
            <Alert severity="error">Kullanıcılar yüklenemedi.</Alert>
          ) : users.length === 0 ? (
            <Alert severity="info">Henüz kullanıcı bulunmuyor.</Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell align="right">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id ?? user.email}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        {isSuperAdminRow(user) ? (
                          <Typography variant="body2" color="text.secondary">
                            Super Admin
                          </Typography>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={(event) => handleOpenActions(event, user)}
                            disabled={!user.id}
                          >
                            <MoreVertIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 12px 32px rgba(22, 42, 31, 0.06)",
            }}
            elevation={0}
          >
            <Typography variant="h6" mb={2}>
              Yeni Kullanıcı Oluştur
            </Typography>

            <Box component="form" display="grid" gap={2} onSubmit={handleSubmit}>
              <TextField
                label="Ad Soyad"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {isExternalEmail && (
                <Alert severity="warning">
                  `@disastechnology.com` dışındaki kullanıcılar Google Takvim ve mail
                  servislerini kullanamayabilir.
                </Alert>
              )}
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="Şifre Tekrar"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <TextField
                select
                label="Rol"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                {ROLE_OPTIONS.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Button
                type="submit"
                variant="contained"
                sx={{ height: 44 }}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? (
                  <CircularProgress size={22} />
                ) : (
                  "Kullanıcı Oluştur"
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleCloseActions}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            if (actionsUser) {
              handleOpenEdit(actionsUser);
            }
            handleCloseActions();
          }}
          disabled={!actionsUser?.id}
        >
          Düzenle
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionsUser) {
              handleDelete(actionsUser);
            }
            handleCloseActions();
          }}
          disabled={!actionsUser?.id || deleteUserMutation.isPending}
          sx={{ color: "error.main" }}
        >
          Sil
        </MenuItem>
      </Menu>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogTitle>Kullanıcı Düzenle</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField
              label="Ad Soyad"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              required
            />
            <TextField
              label="E-posta"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
            {isExternalEditEmail && (
              <Alert severity="warning">
                `@disastechnology.com` dışındaki kullanıcılar Google Takvim ve mail
                servislerini kullanamayabilir.
              </Alert>
            )}
            <TextField
              select
              label="Rol"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              required
            >
              {ROLE_OPTIONS.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Yeni Şifre (opsiyonel)"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <TextField
              label="Yeni Şifre Tekrar (opsiyonel)"
              type="password"
              value={editPasswordConfirm}
              onChange={(e) => setEditPasswordConfirm(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditOpen(false)}>Vazgeç</Button>
            <Button type="submit" variant="contained" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? <CircularProgress size={20} /> : "Kaydet"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
