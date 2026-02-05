import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../../api/auth.api";
import { isAuthenticated, setToken } from "../../auth/token";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/meetings", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      const token = res.token ?? res.accessToken;
      if (!token) {
        setError("Token alınamadı. Backend response formatını kontrol edin.");
        return;
      }
      setToken(token);
      navigate("/meetings", { replace: true });
    } catch (err) {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fb",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 420, p: 4 }} elevation={3}>
        <Typography variant="h5" mb={1}>
          Disastech CRM
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Devam etmek için giriş yapın
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
          <TextField
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ height: 44 }}
          >
            {loading ? <CircularProgress size={22} /> : "Giriş Yap"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
