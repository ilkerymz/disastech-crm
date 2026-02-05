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
import { useNavigate } from "react-router-dom";

interface Props {
  width: number;
}

export default function Sidebar({ width }: Props) {
  const navigate = useNavigate();

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
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box
          component="img"
          src="/src/assets/svg-disastech-logotype/disastech-logotype.svg"
          alt="Disastech"
          sx={{
            maxWidth: "80%",
            maxHeight: 28,
            objectFit: "contain",
          }}
        />
      </Toolbar>
      <List>
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
      </List>
    </Drawer>
  );
}
