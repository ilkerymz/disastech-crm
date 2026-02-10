import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getMeetings } from "../../api/meeting.api";
import type { Meeting } from "../../types/meeting";

import MeetingDetailDialog from "../../components/meetings/MeetingDetailDialog";

export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: meetings = [], isLoading } = useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  const visibleMeetings = meetings.filter(
    (m) => m.status !== "CANCELLED" && m.nextActionDate
  );

  const calendarEvents = visibleMeetings.map((m) => ({
    id: String(m.id),
    title: m.nextAction || "Toplantı",
    start: m.nextActionDate,
    extendedProps: {
      meeting: m,
    },
  }));

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Takvim
      </Typography>

      <Box className="fc">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={calendarEvents}
          eventClick={(info) => {
            const meeting = info.event.extendedProps.meeting as Meeting;
            setSelectedMeeting(meeting);
            setDetailOpen(true);
          }}
        />
      </Box>

      <MeetingDetailDialog
        open={detailOpen}
        meeting={selectedMeeting}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMeeting(null);
        }}
      />
    </Box>
  );
}
