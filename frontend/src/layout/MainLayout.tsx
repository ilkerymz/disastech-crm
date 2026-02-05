import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const SIDEBAR_WIDTH = 240;

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar width={SIDEBAR_WIDTH} />

      {/* Main Area */}
      <Box sx={{ flexGrow: 1 }}>
        <Header sidebarWidth={SIDEBAR_WIDTH} />
        <Toolbar />

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
