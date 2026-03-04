import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { clearToken, isSuperAdmin } from "../auth/token";
import disastechLogo from "../assets/svg-disastech-logotype/disastech-logotype.svg";

interface Props {
  width: number;
}

export default function Sidebar({ width }: Props) {
  const navigate = useNavigate();
  const superAdmin = isSuperAdmin();
  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Box
            component="img"
            src={disastechLogo}
            alt="Disastech"
            sx={{
              maxWidth: "80%",
              maxHeight: 28,
              objectFit: "contain",
            }}
          />
        </Toolbar>

        <List sx={{ flexGrow: 1 }}>
          <ListItemButton onClick={() => navigate("/meetings")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Toplantılar" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/accounts")}>
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Firmalar" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/calendar")}>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Takvim" />
          </ListItemButton>

          {superAdmin && (
            <ListItemButton onClick={() => navigate("/admin/users")}>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          )}
        </List>

        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
