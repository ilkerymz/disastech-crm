import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, type MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Account } from "../../types/account";
import { getAccountStatusLabel } from "../../constants/accountStatus";
import { getContactsByAccountAndActiveTrue } from "../../api/contact.api";
import type { Contact } from "../../types/contact";

interface Props {
  rows: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onOpenContacts: (account: Account) => void;
}

function AccountContactsCell({
  account,
  onOpenContacts,
}: {
  account: Account;
  onOpenContacts: (account: Account) => void;
}) {
  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["contacts", account.id],
    queryFn: () => getContactsByAccountAndActiveTrue(account.id),
  });

  if (contacts.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ cursor: "pointer", color: "text.secondary" }}
        onClick={(event) => {
          event.stopPropagation();
          onOpenContacts(account);
        }}
      >
        Kişi ekle
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.75,
        overflowX: "auto",
        py: 0.5,
        pr: 1,
        width: "100%",
        scrollbarWidth: "thin",
      }}
      onClick={(event) => {
        event.stopPropagation();
        onOpenContacts(account);
      }}
    >
      {contacts.map((contact) => (
        <Chip
          key={contact.id}
          label={contact.fullName}
          size="small"
          clickable
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
}

export default function AccountTable({
  rows,
  onEdit,
  onDelete,
  onOpenContacts,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, account: Account) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedAccount(account);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAccount(null);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Firma", flex: 1 },
    { field: "industry", headerName: "Sektör", flex: 1 },
    {
      field: "phone",
      headerName: "Telefon",
      flex: 1,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "email",
      headerName: "E-posta",
      flex: 1,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "responsibleUserName",
      headerName: "Sorumlu Kişi",
      flex: 1,
      valueFormatter: (value) => value || "-",
    },
    {
      field: "contacts",
      headerName: "Kişiler",
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <AccountContactsCell
          account={params.row as Account}
          onOpenContacts={onOpenContacts}
        />
      ),
    },
    {
      field: "status",
      headerName: "Durum",
      flex: 1,
      valueFormatter: (value) => getAccountStatusLabel(value),
    },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="İşlemler">
          <IconButton
            size="small"
            sx={{
              width: 28,
              height: 28,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
            }}
            onClick={(event) => {
              handleOpenMenu(event, params.row as Account);
            }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
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
        autoHeight
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            if (selectedAccount) {
              onEdit(selectedAccount);
            }
            handleCloseMenu();
          }}
        >
          Düzenle
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedAccount) {
              onOpenContacts(selectedAccount);
            }
            handleCloseMenu();
          }}
        >
          Kişiler
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            if (selectedAccount && confirm("Firma silinecek. Emin misiniz?")) {
              onDelete(selectedAccount.id);
            }
            handleCloseMenu();
          }}
        >
          Sil
        </MenuItem>
      </Menu>
    </>
  );
}
