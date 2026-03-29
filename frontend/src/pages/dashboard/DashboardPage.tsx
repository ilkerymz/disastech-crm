import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { addProcessNote, getProcesses, updateProcess } from "../../api/process.api";
import ProcessEditDialog from "../../components/dashboard/ProcessEditDialog";
import ProcessNotesDialog from "../../components/dashboard/ProcessNotesDialog";
import ProcessTable from "../../components/tables/ProcessTable";
import type { Process, UpdateProcessPayload } from "../../types/process";
import { ACCOUNT_STATUS_OPTIONS, getAccountStatusLabel } from "../../constants/accountStatus";
import { SALES_STAGE_OPTIONS, getSalesStageLabel } from "../../constants/salesStage";

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

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");

  const {
    data: processes = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Process[]>({
    queryKey: ["processes"],
    queryFn: getProcesses,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      processId,
      payload,
    }: {
      processId: string;
      payload: UpdateProcessPayload;
    }) => updateProcess(processId, payload),
  });

  const responsibleOptions = useMemo(() => {
    const names = processes
      .map((process) => process.responsibleUserName)
      .filter((name): name is string => Boolean(name && name.trim()));

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [processes]);

  const filteredProcesses = useMemo(() => {
    const normalizedCompanyFilter = normalizeText(companyFilter);

    return processes.filter((process) => {
      const matchesCompany =
        !normalizedCompanyFilter ||
        normalizeText(process.accountName ?? "").includes(normalizedCompanyFilter);

      const matchesStatus =
        !statusFilter || process.accountStatus === statusFilter;

      const matchesStage =
        !stageFilter || process.salesStage === stageFilter;

      const matchesResponsible =
        !responsibleFilter ||
        process.responsibleUserName === responsibleFilter;

      return (
        matchesCompany &&
        matchesStatus &&
        matchesStage &&
        matchesResponsible
      );
    });
  }, [
    companyFilter,
    processes,
    responsibleFilter,
    stageFilter,
    statusFilter,
  ]);

  const handleEdit = (process: Process) => {
    setSelectedProcess(process);
    setEditOpen(true);
  };

  const handleOpenNotes = (process: Process) => {
    setSelectedProcess(process);
    setNotesOpen(true);
  };

  const handleSave = async ({
    payload,
    negativeReasonNote,
  }: {
    payload: UpdateProcessPayload;
    negativeReasonNote?: string;
  }) => {
    if (!selectedProcess) {
      return;
    }

    await updateMutation.mutateAsync({
      processId: selectedProcess.id,
      payload,
    });

    if (negativeReasonNote) {
      await addProcessNote(selectedProcess.id, {
        note: negativeReasonNote,
        isNegativeReason: true,
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["processes"] });
    await queryClient.invalidateQueries({
      queryKey: ["process-notes", selectedProcess.id],
    });

    setEditOpen(false);
    setSelectedProcess(null);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Süreç verileri alınırken hata oluştu.</Alert>;
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Süreçler</Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Yenile
        </Button>
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
              setStageFilter("");
              setResponsibleFilter("");
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
            label="Firma Adı"
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
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            fullWidth
            size="small"
            label="Süreç Stage"
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
            {SALES_STAGE_OPTIONS.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {getSalesStageLabel(stage)}
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
        </Box>

        <ProcessTable
          rows={filteredProcesses}
          onEdit={handleEdit}
          onOpenNotes={handleOpenNotes}
        />
      </Box>

      <ProcessEditDialog
        open={editOpen}
        process={selectedProcess}
        onClose={() => {
          setEditOpen(false);
          setSelectedProcess(null);
        }}
        onSave={handleSave}
        onOpenNotes={handleOpenNotes}
      />

      <ProcessNotesDialog
        open={notesOpen}
        process={selectedProcess}
        onClose={() => {
          setNotesOpen(false);
          setSelectedProcess(null);
        }}
      />
    </>
  );
}
