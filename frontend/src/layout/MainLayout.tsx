import { Box, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 76;

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar width={sidebarWidth} open={sidebarOpen} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Header
          sidebarWidth={sidebarWidth}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <Toolbar />

        <Box sx={{ p: 3, minWidth: 0, overflowX: "hidden" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
