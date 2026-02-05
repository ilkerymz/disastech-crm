import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMeetings,
  getInvitePreview,
  sendMeetingInvite,
  updateMeeting,
  cancelMeeting,
  type InvitePreview,
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import type { Meeting } from "../../types/meeting";

export default function MeetingListPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<InvitePreview | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMeeting, setDetailMeeting] = useState<Meeting | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  // --------------------
  // INVITE
  // --------------------
  const handleRequestSendInvite = async (meetingId: string) => {
    const preview = await getInvitePreview(meetingId);
    setSelectedId(meetingId);
    setPreviewData(preview);
    setPreviewOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!selectedId) return;

    await sendMeetingInvite(selectedId);

    setPreviewOpen(false);
    setPreviewData(null);
    setSelectedId(null);

    queryClient.invalidateQueries({ queryKey: ["meetings"] });
  };

  // --------------------
  // UPDATE
  // --------------------
  const formatDateForPayload = (value?: string | Date) => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setUpdateOpen(true);
  };

  const handleUpdateMeeting = async (updated: Partial<Meeting>) => {
    if (!selectedMeeting) return;

    const nextActionDateValue =
      updated.nextActionDate === ""
        ? undefined
        : updated.nextActionDate ?? selectedMeeting.nextActionDate;

    const nextActionDate = formatDateForPayload(nextActionDateValue);
    const payload = {
      notes: updated.notes ?? selectedMeeting.notes,
      subject: updated.subject ?? selectedMeeting.subject,
      nextAction: updated.nextAction ?? selectedMeeting.nextAction,
      nextActionDate: nextActionDate || undefined,
      ...(nextActionDate
        ? {
            start: `${nextActionDate}T09:00`,
            end: `${nextActionDate}T10:00`,
          }
        : {}),
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

  const visibleRows = data?.filter(
    (meeting) => meeting.status !== "CANCELLED"
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Toplantılar</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Yeni Toplantı
        </Button>
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

      {visibleRows && (
        <MeetingTable
          rows={visibleRows}
          onRequestSendInvite={handleRequestSendInvite}
          onEdit={handleEditMeeting}
          onCancel={handleCancelMeeting}
          onRowClick={handleOpenDetail}
        />
      )}

      <InvitePreviewDialog
        open={previewOpen}
        preview={previewData}
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
