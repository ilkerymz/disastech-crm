import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Meeting } from "../../types/meeting";
import { useState, type MouseEvent } from "react";

import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAccountStatusLabel } from "../../constants/accountStatus";
import { formatContactDisplay } from "../../utils/contact";

interface Props {
  rows: Meeting[];
  onRequestSendInvite: (meetingId: string) => void;
  onEdit: (meeting: Meeting) => void;
  onCancel: (id: string) => void;
  onRowClick?: (meeting: Meeting) => void;
}

export default function MeetingTable({
  rows,
  onRequestSendInvite,
  onEdit,
  onCancel,
  onRowClick,
}: Props) {
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const handleOpenActions = (
    event: MouseEvent<HTMLElement>,
    meeting: Meeting
  ) => {
    event.stopPropagation();
    setActionsAnchorEl(event.currentTarget);
    setSelectedMeeting(meeting);
  };

  const handleCloseActions = () => {
    setActionsAnchorEl(null);
  };

  const columns: GridColDef[] = [
    { field: "accountName", headerName: "Firma", flex: 1 },
    {
      field: "contactName",
      headerName: "İlgili Kişi",
      flex: 1,
      valueGetter: (_, row) => formatContactDisplay(row as Meeting),
    },
    { field: "industry", headerName: "Sektör", flex: 1 },
    {
      field: "accountStatus",
      headerName: "Firma Durumu",
      flex: 1,
      valueFormatter: (value) => getAccountStatusLabel(value),
    },
    {
      field: "userName",
      headerName: "Sorumlu Kişi",
      flex: 1,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "notes",
      headerName: "Not",
      minWidth: 230,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => {
        return (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(params.row as Meeting).notes || "-"}
          </Typography>
        );
      },
    },

    {
      field: "start",
      headerName: "Toplantı Tarihi",
      flex: 1,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleString("tr-TR")
          : "-",
    },

    {
      field: "mailStatus",
      headerName: "Davetiye",
      width: 92,
      sortable: false,
      renderCell: (params) => {
        const sent = params.value === "SENT";

        return (
          <Tooltip title={sent ? "Gönderildi" : "Mail Gönder"}>
            <span>
              <IconButton
                size="small"
                color={sent ? "success" : "primary"}
                disabled={sent}
                sx={{
                  width: 26,
                  height: 26,
                  border: "1px solid",
                  borderColor: sent ? "success.main" : "primary.main",
                  borderRadius: 999,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onRequestSendInvite(params.row.id as string);
                }}
              >
                {sent ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                ) : (
                  <MailOutlineIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },

    {
      field: "actions",
      headerName: "",
      width: 54,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="İşlemler">
          <IconButton
            size="small"
            sx={{
              width: 24,
              height: 24,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
            }}
            onClick={(event) => handleOpenActions(event, params.row as Meeting)}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        disableRowSelectionOnClick
        onRowClick={(params) => {
          if (onRowClick) {
            onRowClick(params.row as Meeting);
          }
        }}
        autoHeight
      />
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleCloseActions}
        onClick={(event) => event.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            if (!selectedMeeting) return;
            onEdit(selectedMeeting);
            handleCloseActions();
          }}
        >
          Düzenle
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!selectedMeeting) return;
            if (confirm("Toplantı silinecek. Emin misiniz?")) {
              onCancel(String(selectedMeeting.id));
            }
            handleCloseActions();
          }}
          sx={{ color: "error.main" }}
        >
          Sil
        </MenuItem>
      </Menu>
    </>
  );
}
