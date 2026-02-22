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
import MeetingNotesDialog from "../../components/meetings/MeetingNotesDialog";

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
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesMeeting, setNotesMeeting] = useState<Meeting | null>(null);

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

  const handleConfirmSend = async (description: string) => {
    if (!selectedId) return;

    const normalizedDescription = description.trim();
    await sendMeetingInvite(
      selectedId,
      normalizedDescription ? normalizedDescription : undefined
    );

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
      nextAction: updated.nextAction ?? selectedMeeting.nextAction,
      salesStatus: updated.salesStatus ?? selectedMeeting.salesStatus,
      salesStage: updated.salesStage ?? selectedMeeting.salesStage,
      offerAmount: updated.offerAmount ?? selectedMeeting.offerAmount,
      lastMeetingDate: updated.lastMeetingDate ?? selectedMeeting.lastMeetingDate,
      lossReason: updated.lossReason ?? selectedMeeting.lossReason,
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

  const handleOpenNotes = (meeting: Meeting) => {
    setNotesMeeting(meeting);
    setNotesOpen(true);
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
          onOpenNotes={handleOpenNotes}
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

      <MeetingNotesDialog
        open={notesOpen}
        meeting={notesMeeting}
        onClose={() => {
          setNotesOpen(false);
          setNotesMeeting(null);
        }}
      />
    </>
  );
}
