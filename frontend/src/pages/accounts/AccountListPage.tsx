import { Typography, Button, Box, MenuItem, Stack, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMemo, useState } from "react";

import { deleteAccount, getActiveAccounts } from "../../api/account.api";
import type { Account } from "../../types/account";
import CreateAccountDialog from "../../components/accounts/CreateAccountDialog";
import UpdateAccountDialog from "../../components/accounts/UpdateAccountDialog";
import AccountContactsDialog from "../../components/accounts/AccountContactsDialog";
import AccountTable from "../../components/tables/AccountTable";
import {
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusLabel,
} from "../../constants/accountStatus";

const normalizeText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

export default function AccountListPage() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
    isFetching,
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

  const responsibleOptions = useMemo(() => {
    const names = accounts
      .map((account) => account.responsibleUserName)
      .filter((name): name is string => Boolean(name && name.trim()));

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [accounts]);

  const industryOptions = useMemo(() => {
    const industries = accounts
      .map((account) => account.industry)
      .filter((industry): industry is string => Boolean(industry && industry.trim()));

    return Array.from(new Set(industries)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const normalizedCompanyFilter = normalizeText(companyFilter);

    return accounts.filter((account) => {
      const matchesCompany =
        !normalizedCompanyFilter ||
        normalizeText(account.name ?? "").includes(normalizedCompanyFilter);

      const matchesStatus =
        !statusFilter || account.status === statusFilter;

      const matchesResponsible =
        !responsibleFilter || account.responsibleUserName === responsibleFilter;

      const matchesIndustry =
        !industryFilter ||
        normalizeText(account.industry ?? "") === normalizeText(industryFilter);

      return (
        matchesCompany &&
        matchesStatus &&
        matchesResponsible &&
        matchesIndustry
      );
    });
  }, [accounts, companyFilter, industryFilter, responsibleFilter, statusFilter]);

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Hata oluştu</div>;

  return (
    <Box>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Firmalar</Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Yeni Firma
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(244,247,244,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid #dce5dc",
          borderRadius: 4,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography
            variant="overline"
            sx={{
              color: "#5f6f65",
              fontWeight: 700,
              letterSpacing: 0.9,
            }}
          >
            Filtreler
          </Typography>

          <Button
            size="small"
            variant="text"
            onClick={() => {
              setCompanyFilter("");
              setStatusFilter("");
              setResponsibleFilter("");
              setIndustryFilter("");
            }}
            sx={{
              minWidth: "auto",
              px: 0.5,
              color: "#5f6f65",
            }}
          >
            Temizle
          </Button>
        </Stack>

        <Box
          mb={2.5}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "1.2fr 0.9fr 0.9fr 0.9fr",
            },
            gap: 1,
            p: 1,
            width: "100%",
            overflow: "hidden",
            border: "1px solid #d7e1d7",
            borderRadius: 3,
            background:
              "linear-gradient(180deg, rgba(248,250,248,0.98) 0%, rgba(242,246,242,0.9) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
            "& > *": {
              minWidth: 0,
            },
          }}
        >
          <TextField
            label="Şirket Adı"
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 2,
              },
            }}
          />

          <TextField
            select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            fullWidth
            size="small"
            label="Firma Durumu"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {ACCOUNT_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {getAccountStatusLabel(status)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={responsibleFilter}
            onChange={(event) => setResponsibleFilter(event.target.value)}
            fullWidth
            size="small"
            label="Sorumlu Kişi"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {responsibleOptions.map((responsibleName) => (
              <MenuItem key={responsibleName} value={responsibleName}>
                {responsibleName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={industryFilter}
            onChange={(event) => setIndustryFilter(event.target.value)}
            fullWidth
            size="small"
            label="Sektör"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: 13,
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="">Tümü</MenuItem>
            {industryOptions.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <AccountTable
          rows={filteredAccounts}
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
      </Box>

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
