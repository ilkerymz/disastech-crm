import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMeetings,
  getInvitePreview,
  sendMeetingInvite,
  updateMeeting,
  cancelMeeting,
  type InvitePreview,
  type SendMeetingInvitePayload,
} from "../../api/meeting.api";

import MeetingTable from "../../components/tables/MeetingTable";
import InvitePreviewDialog from "../../components/meetings/InvitePreviewDialog";
import CreateMeetingDialog from "../../components/meetings/CreateMeetingDialog";
import UpdateMeetingDialog from "../../components/meetings/UpdateMeetingDialog";
import MeetingDetailDialog from "../../components/meetings/MeetingDetailDialog";

import {
  Box,
  CircularProgress,
  Typography,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useMemo, useState } from "react";

import type { Meeting } from "../../types/meeting";

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

const getMeetingFilterDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function MeetingListPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<InvitePreview | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMeeting, setDetailMeeting] = useState<Meeting | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [meetingDateFilter, setMeetingDateFilter] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  const visibleRows = useMemo(
    () => data?.filter((meeting) => meeting.status !== "CANCELLED") ?? [],
    [data]
  );

  const responsibleOptions = useMemo(() => {
    const names = visibleRows
      .map((meeting) => meeting.userName)
      .filter((name): name is string => Boolean(name && name.trim()));

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [visibleRows]);

  const filteredMeetings = useMemo(() => {
    const normalizedCompanyFilter = normalizeText(companyFilter);

    return visibleRows.filter((meeting) => {
      const matchesCompany =
        !normalizedCompanyFilter ||
        normalizeText(meeting.accountName ?? "").includes(normalizedCompanyFilter);

      const matchesResponsible =
        !responsibleFilter || meeting.userName === responsibleFilter;

      const matchesMeetingDate =
        !meetingDateFilter ||
        getMeetingFilterDate(meeting.start) === meetingDateFilter;

      return matchesCompany && matchesResponsible && matchesMeetingDate;
    });
  }, [companyFilter, meetingDateFilter, responsibleFilter, visibleRows]);

  const inviteMeeting = useMemo(
    () =>
      selectedId
        ? visibleRows.find((meeting) => String(meeting.id) === selectedId) ?? null
        : null,
    [selectedId, visibleRows]
  );

  // --------------------
  // INVITE
  // --------------------
  const handleRequestSendInvite = async (meetingId: string) => {
    const preview = await getInvitePreview(meetingId);
    setSelectedId(meetingId);
    setPreviewData(preview);
    setPreviewOpen(true);
  };

  const handleConfirmSend = async (payload: SendMeetingInvitePayload) => {
    if (!selectedId) return;

    await sendMeetingInvite(selectedId, payload);

    setPreviewOpen(false);
    setPreviewData(null);
    setSelectedId(null);

    queryClient.invalidateQueries({ queryKey: ["meetings"] });
  };

  // --------------------
  // UPDATE
  // --------------------
  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setUpdateOpen(true);
  };

  const handleUpdateMeeting = async (updated: Partial<Meeting>) => {
    if (!selectedMeeting) return;

    const payload = {
      subject: updated.subject ?? selectedMeeting.subject,
      start: updated.start ?? selectedMeeting.start,
      end: updated.end ?? selectedMeeting.end,
      notes: updated.notes ?? selectedMeeting.notes,
      status: updated.status ?? selectedMeeting.status,
    };

    await updateMeeting(String(selectedMeeting.id), payload);
    queryClient.invalidateQueries({ queryKey: ["meetings"] });
    setUpdateOpen(false);
    setSelectedMeeting(null);
  };

  // --------------------
  // DELETE
  // --------------------
  const handleCancelMeeting = async (id: string) => {
    await cancelMeeting(id);
    queryClient.invalidateQueries({ queryKey: ["meetings"] });
  };

  const handleOpenDetail = (meeting: Meeting) => {
    setDetailMeeting(meeting);
    setDetailOpen(true);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Bir hata oluştu</div>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Toplantılar</Typography>

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
            onClick={() => setCreateOpen(true)}
          >
            Yeni Toplantı
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
              setResponsibleFilter("");
              setMeetingDateFilter("");
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
              lg: "1.2fr 1fr 1fr",
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
            label="Toplantı Tarihi"
            type="date"
            value={meetingDateFilter}
            onChange={(event) => setMeetingDateFilter(event.target.value)}
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
        </Box>

        <MeetingTable
          rows={filteredMeetings}
          onRequestSendInvite={handleRequestSendInvite}
          onEdit={handleEditMeeting}
          onCancel={handleCancelMeeting}
          onRowClick={handleOpenDetail}
        />
      </Box>

      <CreateMeetingDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <UpdateMeetingDialog
        open={updateOpen}
        meeting={selectedMeeting}
        onClose={() => {
          setUpdateOpen(false);
          setSelectedMeeting(null);
        }}
        onSave={handleUpdateMeeting}
      />

      <InvitePreviewDialog
        open={previewOpen}
        preview={previewData}
        accountId={inviteMeeting?.accountId}
        primaryContactId={inviteMeeting?.contactId}
        ownerUserId={inviteMeeting?.ownerUserId}
        onCancel={() => setPreviewOpen(false)}
        onConfirm={handleConfirmSend}
      />

      <MeetingDetailDialog
        open={detailOpen}
        meeting={detailMeeting}
        onClose={() => {
          setDetailOpen(false);
          setDetailMeeting(null);
        }}
      />
    </>
  );
}
