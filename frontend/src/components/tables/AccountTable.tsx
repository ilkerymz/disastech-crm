import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";

import type { Account } from "../../types/account";
import { getAccountStatusLabel } from "../../constants/accountStatus";

interface Props {
  rows: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onOpenContacts: (account: Account) => void;
}

export default function AccountTable({
  rows,
  onEdit,
  onDelete,
  onOpenContacts,
}: Props) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Firma", flex: 1 },
    { field: "industry", headerName: "Sektör", flex: 1 },
    {
      field: "status",
      headerName: "Durum",
      flex: 1,
      valueFormatter: (value) => getAccountStatusLabel(value),
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
              onEdit(params.row as Account);
            }}
          >
            Düzenle
          </Button>

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
              onOpenContacts(params.row as Account);
            }}
          >
            Kişiler
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
              if (confirm("Firma silinecek. Emin misiniz?")) {
                onDelete(params.row.id as string);
              }
            }}
          >
            Sil
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
      autoHeight
    />
  );
}
