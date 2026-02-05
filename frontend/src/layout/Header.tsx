import { AppBar, Toolbar, Typography, Box } from "@mui/material";

interface Props {
  sidebarWidth: number;
}

export default function Header({ sidebarWidth }: Props) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Disastech CRM
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* ileride: user menu / logout */}
      </Toolbar>
    </AppBar>
  );
}
