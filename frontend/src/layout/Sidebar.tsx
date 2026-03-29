import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { clearToken, isSuperAdmin } from "../auth/token";
import disastechLogo from "../assets/svg-disastech-logotype/disastech-logotype.svg";
import disastechIcon from "../assets/svg-D-icon-disastech/D-icon-disastech.svg";

interface Props {
  width: number;
  open: boolean;
}

export default function Sidebar({ width, open }: Props) {
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
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter,
            }),
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Toolbar sx={{ justifyContent: open ? "center" : "center", px: 1 }}>
          <Box
            component="img"
            src={open ? disastechLogo : disastechIcon}
            alt="Disastech"
            sx={{
              maxWidth: open ? "80%" : 28,
              maxHeight: 28,
              objectFit: "contain",
            }}
          />
        </Toolbar>

        <List sx={{ flexGrow: 1 }}>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <AccountTreeOutlinedIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Firma Süreci" />}
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/meetings")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Toplantılar" />}
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/accounts")}>
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Firmalar" />}
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/calendar")}>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Takvim" />}
          </ListItemButton>

          {superAdmin && (
            <ListItemButton onClick={() => navigate("/admin/users")}>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Admin" />}
            </ListItemButton>
          )}
        </List>

        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Çıkış Yap" />}
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
