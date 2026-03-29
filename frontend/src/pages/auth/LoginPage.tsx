import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../../api/auth.api";
import {
  getPostLoginRoute,
  isAuthenticated,
  setToken,
} from "../../auth/token";
import logotype from "../../assets/svg-disastech-logotype/disastech-logotype.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(getPostLoginRoute(), { replace: true });
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
      navigate(getPostLoginRoute(), { replace: true });
    } catch (err) {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "100dvh",
        px: { xs: 2, md: 4 },
        py: 0,
        background:
          "radial-gradient(circle at top left, rgba(184,212,198,0.9) 0%, rgba(244,247,244,0.96) 28%, rgba(233,238,247,0.95) 65%, rgba(247,244,237,0.92) 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "auto auto -160px -120px",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(38,84,66,0.16) 0%, rgba(38,84,66,0) 70%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: "-120px -90px auto auto",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(193,143,74,0.18) 0%, rgba(193,143,74,0) 72%)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          borderRadius: { xs: 4, md: 6 },
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "0 24px 70px rgba(33, 43, 54, 0.14), 0 6px 24px rgba(33, 43, 54, 0.08)",
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.72)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            color: "#183229",
            background:
              "linear-gradient(145deg, rgba(239,246,241,0.92) 0%, rgba(223,237,229,0.78) 46%, rgba(245,237,223,0.74) 100%)",
          }}
        >
          <Box
            component="img"
            src={logotype}
            alt="Disastech"
            sx={{
              width: { xs: 180, md: 220 },
              maxWidth: "100%",
              mb: 4,
              display: "block",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 28, md: 40 },
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              maxWidth: 420,
              mb: 1.5,
            }}
          >
            CRM Workspace.
          </Typography>

          <Typography
            sx={{
              color: "rgba(24,50,41,0.74)",
              fontSize: { xs: 15, md: 16 },
              maxWidth: 420,
              mb: { xs: 3, md: 4 },
            }}
          >
            Kaldığın yerden devam etmek için giriş yapman yeterli.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: 1.25,
              maxWidth: 540,
            }}
          >
            {[
              ["Süreç", "Satış Süreç Takibi"],
              ["Takvim", "Toplantıları Takibi"],
              ["Firma", "Müşteri Yönetimi"],
            ].map(([title, text]) => (
              <Box
                key={title}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid rgba(24,50,41,0.08)",
                  backgroundColor: "rgba(255,255,255,0.48)",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.25 }}>
                  {title}
                </Typography>
                <Typography sx={{ color: "rgba(24,50,41,0.68)", fontSize: 13 }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.95) 100%)",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 34 },
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#17242e",
                mb: 1,
              }}
            >
              Oturum Aç
            </Typography>
            <Typography sx={{ color: "rgba(23,36,46,0.62)", mb: 3 }}>
              E-posta ve şifreni gir.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
              <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.94)",
                  },
                }}
              />
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.94)",
                  },
                }}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  height: 52,
                  borderRadius: 3,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  textTransform: "none",
                  fontSize: 16,
                  background:
                    "linear-gradient(135deg, #214337 0%, #2c6b57 55%, #c18f4a 140%)",
                  boxShadow: "0 14px 30px rgba(33,67,55,0.22)",
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Panele Gir"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
