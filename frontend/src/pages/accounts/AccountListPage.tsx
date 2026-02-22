import { Typography, Button, Box } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import { deleteAccount, getActiveAccounts } from "../../api/account.api";
import type { Account } from "../../types/account";
import CreateAccountDialog from "../../components/accounts/CreateAccountDialog";
import UpdateAccountDialog from "../../components/accounts/UpdateAccountDialog";
import AccountContactsDialog from "../../components/accounts/AccountContactsDialog";
import AccountTable from "../../components/tables/AccountTable";

export default function AccountListPage() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isLoading,
    isError,
  } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: getActiveAccounts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Hata oluştu</div>;

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Firmalar</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Yeni Firma
        </Button>
      </Box>

      {/* TABLE */}
      <AccountTable
        rows={accounts}
        onEdit={(account) => {
          setSelectedAccount(account);
          setUpdateOpen(true);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
        onOpenContacts={(account) => {
          setSelectedAccount(account);
          setContactsOpen(true);
        }}
      />

      {/* DIALOG */}
      <CreateAccountDialog
        open={open}
        onClose={() => setOpen(false)}
      />

      <UpdateAccountDialog
        open={updateOpen}
        account={selectedAccount}
        onClose={() => {
          setUpdateOpen(false);
          setSelectedAccount(null);
        }}
      />

      <AccountContactsDialog
        open={contactsOpen}
        account={selectedAccount}
        onClose={() => {
          setContactsOpen(false);
          setSelectedAccount(null);
        }}
      />
    </Box>
  );
}
