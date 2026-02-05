import { Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import { getAccounts } from "../../api/account.api";
import type { Account } from "../../types/account";
import AccountCard from "../../components/accounts/AccountCard";
import CreateAccountDialog from "../../components/accounts/CreateAccountDialog";

export default function AccountListPage() {
  const [open, setOpen] = useState(false);

  const {
    data: accounts = [],
    isLoading,
    isError,
  } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: getAccounts,
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

      {/* GRID */}
      <Grid container spacing={2}>
        {accounts.map((account) => (
          <Grid item xs={12} md={6} lg={4} key={account.id}>
            <AccountCard account={account} />
          </Grid>
        ))}
      </Grid>

      {/* DIALOG */}
      <CreateAccountDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}
