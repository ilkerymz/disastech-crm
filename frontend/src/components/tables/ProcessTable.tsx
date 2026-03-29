import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import type { Process } from "../../types/process";
import {
  getSalesStageLabel,
  SALES_STAGE_COLORS,
} from "../../constants/salesStage";
import { getAccountStatusLabel } from "../../constants/accountStatus";
import type { SalesStage } from "../../types/meeting";
import { formatMoney, type CurrencyCode } from "../../constants/currency";

interface Props {
  rows: Process[];
  onEdit: (process: Process) => void;
  onOpenNotes: (process: Process) => void;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("tr-TR") : "-";

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString("tr-TR") : "-";

export default function ProcessTable({ rows, onEdit, onOpenNotes }: Props) {
  const columns: GridColDef[] = [
    {
      field: "accountName",
      headerName: "Firma Adı",
      minWidth: 180,
      flex: 1.2,
    },
    {
      field: "salesStage",
      headerName: "Stage",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        const stage = params.value as SalesStage | null | undefined;

        return (
          <Chip
            label={getSalesStageLabel(stage)}
            size="small"
            sx={{
              backgroundColor: stage
                ? `${SALES_STAGE_COLORS[stage]}1a`
                : "#eef2ee",
              color: stage ? SALES_STAGE_COLORS[stage] : "#5f6f65",
              fontWeight: 700,
            }}
          />
        );
      },
    },
    {
      field: "accountStatus",
      headerName: "Firma Statüsü",
      minWidth: 150,
      flex: 1,
      valueFormatter: (value) => getAccountStatusLabel(value),
    },
    {
      field: "responsibleUserName",
      headerName: "Sorumlu Kişi",
      minWidth: 160,
      flex: 1,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "estimatedValue",
      headerName: "Tahmini Satış Değeri",
      minWidth: 180,
      flex: 1,
      align: "right",
      valueGetter: (_, row) =>
        formatMoney(
          (row as Process).estimatedValue,
          ((row as Process).estimatedCurrency ?? "TRY") as CurrencyCode
        ),
    },
    {
      field: "lastMeetingDate",
      headerName: "Son Toplantı Tarihi",
      minWidth: 155,
      flex: 1,
      valueFormatter: (value) => formatDate(value as string | null),
    },
    {
      field: "nextAction",
      headerName: "Sonraki Aksiyon",
      minWidth: 220,
      flex: 1.4,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "nextActionDate",
      headerName: "Sonraki Aksiyon Tarihi",
      minWidth: 170,
      flex: 1,
      valueFormatter: (value) => formatDate(value as string | null),
    },
    {
      field: "latestNote",
      headerName: "Son Not",
      minWidth: 240,
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        const process = params.row as Process;

        return (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
            <Tooltip title="Not Ekle">
              <IconButton
                size="small"
                sx={{ width: 24, height: 24 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenNotes(process);
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
                color: process.latestNoteIsNegativeReason ? "#b91c1c" : "inherit",
                fontWeight: process.latestNoteIsNegativeReason ? 600 : 400,
              }}
              onClick={(event) => {
                event.stopPropagation();
                onOpenNotes(process);
              }}
            >
              {process.latestNote || "Not ekle"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Son Güncelleme",
      minWidth: 180,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value as string | null),
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        disableRowSelectionOnClick
        onRowClick={(params) => onEdit(params.row as Process)}
        autoHeight
        sx={{
          border: 0,
          minWidth: 1280,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f7f4",
            borderBottom: "1px solid #dce5dc",
          },
          "& .MuiDataGrid-cell": {
            alignItems: "center",
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}
