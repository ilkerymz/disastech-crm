import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Meeting } from "../../types/meeting";

import { Button, Stack } from "@mui/material";

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

  const columns: GridColDef[] = [
    { field: "accountName", headerName: "Firma", flex: 1 },
    { field: "contactName", headerName: "İlgili Kişi", flex: 1 },
    { field: "industry", headerName: "Sektör", flex: 1 },
    { field: "accountStatus", headerName: "Firma Durumu", flex: 1 },
    { field: "userName", headerName: "Sorumlu Kişi", flex: 1 },
    { field: "nextAction", headerName: "Sonraki Adım", flex: 1 },
    { field: "notes", headerName: "Not", flex: 2 },

    {
      field: "nextActionDate",
      headerName: "Tarih",
      flex: 1,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("tr-TR")
          : "-",
    },

    {
      field: "mailStatus",
      headerName: "Davetiye",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const sent = params.value === "SENT";

        return (
          <Button
            size="small"
            variant="contained"
            color={sent ? "success" : "primary"}
            disabled={sent}
            onClick={(event) => {
              event.stopPropagation();
              onRequestSendInvite(params.row.id as string);
            }}
          >
            {sent ? "Gönderildi" : "Mail Gönder"}
          </Button>
        );
      },
    },

    {
      field: "actions",
      headerName: "İşlemler",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              minWidth: 32,
              height: 28,
              borderRadius: 999,
              px: 1,
              fontSize: "0.75rem",
            }}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(params.row);
            }}
          >
            Düzenle
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{
              minWidth: 32,
              height: 28,
              borderRadius: 999,
              px: 1,
              fontSize: "0.75rem",
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (confirm("Toplantı iptal edilecek. Emin misiniz?")) {
                onCancel(params.row.id);
              }
            }}
          >
            İptal
          </Button>
        </Stack>
      ),
    },
  ];

  return (
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
  );
}
