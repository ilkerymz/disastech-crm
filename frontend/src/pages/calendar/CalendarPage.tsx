import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RefreshIcon from "@mui/icons-material/Refresh";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getMeetings } from "../../api/meeting.api";
import type { Meeting } from "../../types/meeting";

import MeetingDetailDialog from "../../components/meetings/MeetingDetailDialog";

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

const getMeetingTimeBucket = (start: string) => {
  const meetingDate = new Date(start);
  const today = new Date();

  meetingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (meetingDate.getTime() < today.getTime()) {
    return "calendar-event-past";
  }

  if (meetingDate.getTime() > today.getTime()) {
    return "calendar-event-future";
  }

  return "calendar-event-today";
};

export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");

  const { data: meetings = [], isLoading, refetch, isFetching } = useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

  const visibleMeetings = meetings.filter(
    (m) => m.status !== "CANCELLED" && m.start
  );

  const responsibleOptions = useMemo(() => {
    const names = visibleMeetings
      .map((meeting) => meeting.userName)
      .filter((name): name is string => Boolean(name && name.trim()));

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [visibleMeetings]);

  const filteredMeetings = useMemo(() => {
    const normalizedCompanyFilter = normalizeText(companyFilter);

    return visibleMeetings.filter((meeting) => {
      const matchesCompany =
        !normalizedCompanyFilter ||
        normalizeText(meeting.accountName ?? "").includes(normalizedCompanyFilter);

      const matchesResponsible =
        !responsibleFilter || meeting.userName === responsibleFilter;

      return matchesCompany && matchesResponsible;
    });
  }, [companyFilter, responsibleFilter, visibleMeetings]);

  const getCalendarEventTitle = (meeting: Meeting) => {
    const subject = meeting.subject?.trim();
    const accountName = meeting.accountName?.trim();

    if (subject && accountName) {
      return `${subject} • ${accountName}`;
    }

    return subject || accountName || "Toplantı";
  };

  const calendarEvents = filteredMeetings.map((m) => ({
    id: String(m.id),
    title: getCalendarEventTitle(m),
    start: m.start,
    classNames: m.start ? [getMeetingTimeBucket(m.start)] : [],
    extendedProps: {
      meeting: m,
    },
  }));

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Takvim</Typography>

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
        </Box>

        <Box
          sx={{
            border: "1px solid #dbe5e0",
            borderRadius: 3,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,249,0.96) 100%)",
            boxShadow: "0 18px 42px rgba(22, 42, 31, 0.06)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 1.5, md: 2 },
              py: 1.25,
              borderBottom: "1px solid #e7efea",
              background:
                "linear-gradient(90deg, rgba(246,250,247,0.98) 0%, rgba(255,255,255,0.98) 100%)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.75, sm: 1.5 }}
              >
                {[
                  { label: "Geçmiş", color: "#dc2626", background: "rgba(220, 38, 38, 0.12)" },
                  { label: "Bugün", color: "#d97706", background: "rgba(245, 158, 11, 0.16)" },
                  { label: "Gelecek", color: "#059669", background: "rgba(16, 185, 129, 0.16)" },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 999,
                      background: item.background,
                      color: item.color,
                      fontSize: 13,
                      fontWeight: 700,
                      width: "fit-content",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />
                    {item.label}
                  </Box>
                ))}
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: "#738579",
                  fontWeight: 600,
                }}
              >
                {filteredMeetings.length} toplantı
              </Typography>
            </Stack>
          </Box>

          <Box className="calendar-shell">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="tr"
              firstDay={1}
              fixedWeekCount={false}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              height="auto"
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              events={calendarEvents}
              eventClick={(info) => {
                const meeting = info.event.extendedProps.meeting as Meeting;
                setSelectedMeeting(meeting);
                setDetailOpen(true);
              }}
            />
          </Box>
        </Box>
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
