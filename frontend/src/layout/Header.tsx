import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";

interface Props {
  sidebarWidth: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  sidebarWidth,
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 1.5 }}
        >
          {sidebarOpen ? <MenuOpenOutlinedIcon /> : <MenuOutlinedIcon />}
        </IconButton>

        <Typography variant="h6" noWrap>
          Disastech CRM
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* ileride: user menu / logout */}
      </Toolbar>
    </AppBar>
  );
}
