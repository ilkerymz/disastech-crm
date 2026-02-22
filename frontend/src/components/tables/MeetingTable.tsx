import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Meeting, SalesStatus } from "../../types/meeting";
import { useState, type MouseEvent } from "react";

import {
  IconButton,
  Stack,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import {
  SALES_STATUS_COLORS,
  getSalesStatusLabel,
} from "../../constants/salesStatus";
import { getSalesStageLabel } from "../../constants/salesStage";
import { getLossReasonLabel } from "../../constants/lossReason";
import { getAccountStatusLabel } from "../../constants/accountStatus";

interface Props {
  rows: Meeting[];
  onRequestSendInvite: (meetingId: string) => void;
  onEdit: (meeting: Meeting) => void;
  onCancel: (id: string) => void;
  onOpenNotes: (meeting: Meeting) => void;
  onRowClick?: (meeting: Meeting) => void;
}

export default function MeetingTable({
  rows,
  onRequestSendInvite,
  onEdit,
  onCancel,
  onOpenNotes,
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
    { field: "contactName", headerName: "İlgili Kişi", flex: 1 },
    { field: "industry", headerName: "Sektör", flex: 1 },
    {
      field: "accountStatus",
      headerName: "Firma Durumu",
      flex: 1,
      valueFormatter: (value) => getAccountStatusLabel(value),
    },
    {
      field: "salesStatus",
      headerName: "Satış Durumu",
      flex: 1,
      renderCell: (params) => {
        const status = params.value as SalesStatus | undefined;
        if (!status) return "-";

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: SALES_STATUS_COLORS[status],
                border: "1px solid #1f1f1f",
              }}
            />
            <span>{getSalesStatusLabel(status)}</span>
          </Stack>
        );
      },
    },
    {
      field: "salesStage",
      headerName: "Satış Aşaması",
      flex: 1,
      valueFormatter: (value) => getSalesStageLabel(value),
    },
    { field: "userName", headerName: "Sorumlu Kişi", flex: 1 },
    {
      field: "lossReason",
      headerName: "Kaybedilme Nedeni",
      flex: 1,
      valueFormatter: (value) => getLossReasonLabel(value),
    },
    {
      field: "offerAmount",
      headerName: "Teklif Tutarı (₺)",
      flex: 1,
      valueFormatter: (value) =>
        value === null || value === undefined || value === ""
          ? "-"
          : new Intl.NumberFormat("tr-TR").format(Number(value)),
    },
    {
      field: "lastMeetingDate",
      headerName: "Son Toplantı",
      flex: 1,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("tr-TR") : "-",
    },
    { field: "nextAction", headerName: "Sonraki Adım", flex: 1 },
    {
      field: "notes",
      headerName: "Not",
      minWidth: 230,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => {
        const meeting = params.row as Meeting;
        const lastNote = meeting.latestNote ?? meeting.notes ?? "";

        return (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
            <Tooltip title="Not Ekle">
              <IconButton
                size="small"
                sx={{ width: 24, height: 24 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenNotes(meeting);
                }}
              >
                <NoteAddOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={(event) => {
                event.stopPropagation();
                onOpenNotes(meeting);
              }}
            >
              {lastNote || "Hızlı not"}
            </Typography>
          </Stack>
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
