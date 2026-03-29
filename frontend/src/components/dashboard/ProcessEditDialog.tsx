import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SalesStage } from "../../types/meeting";
import type { AccountStatus } from "../../types/account";
import type { Process, UpdateProcessPayload } from "../../types/process";
import { SALES_STAGE_OPTIONS, getSalesStageLabel } from "../../constants/salesStage";
import {
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusLabel,
} from "../../constants/accountStatus";
import {
  CURRENCY_LABELS,
  CURRENCY_OPTIONS,
  type CurrencyCode,
} from "../../constants/currency";

interface SaveProcessInput {
  payload: UpdateProcessPayload;
  negativeReasonNote?: string;
}

interface Props {
  open: boolean;
  process: Process | null;
  onClose: () => void;
  onSave: (input: SaveProcessInput) => Promise<void> | void;
  onOpenNotes: (process: Process) => void;
}

interface FormState {
  salesStage: SalesStage;
  accountStatus: AccountStatus;
  negativeReasonNote: string;
  estimatedValue: string;
  estimatedCurrency: CurrencyCode;
  nextAction: string;
  nextActionDate: string;
}

const formatEstimatedValueInput = (value: string) => {
  const normalized = value.replace(/\s/g, "").replace(/[^0-9,]/g, "");

  if (!normalized) {
    return "";
  }

  const [rawIntegerPart = "", rawDecimalPart = ""] = normalized.split(",", 2);
  const integerDigits = rawIntegerPart.replace(/^0+(?=\d)/, "") || "0";
  const formattedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalDigits = rawDecimalPart.replace(/[^0-9]/g, "").slice(0, 2);

  return `${formattedInteger},${decimalDigits.padEnd(2, "0")}`;
};

const normalizeEstimatedValueInput = (value: string) => {
  const normalized = value.replace(/\s/g, "").replace(/[^0-9,]/g, "");

  if (!normalized) {
    return "";
  }

  const [rawIntegerPart = "", rawDecimalPart = ""] = normalized.split(",", 2);
  const integerDigits = rawIntegerPart.replace(/^0+(?=\d)/, "") || "0";
  const decimalDigits = rawDecimalPart.replace(/[^0-9]/g, "").slice(0, 2);

  return rawDecimalPart !== undefined && normalized.includes(",")
    ? `${integerDigits},${decimalDigits}`
    : integerDigits;
};

const parseEstimatedValueInput = (value: string) => {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const DEFAULT_FORM: FormState = {
  salesStage: "FIRST_MEETING",
  accountStatus: "POTENTIAL",
  negativeReasonNote: "",
  estimatedValue: "",
  estimatedCurrency: "TRY",
  nextAction: "",
  nextActionDate: "",
};

export default function ProcessEditDialog({
  open,
  process,
  onClose,
  onSave,
  onOpenNotes,
}: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    if (!process) {
      setForm(DEFAULT_FORM);
      return;
    }

    setForm({
      salesStage: process.salesStage ?? "FIRST_MEETING",
      accountStatus: process.accountStatus ?? "POTENTIAL",
      negativeReasonNote: "",
      estimatedValue:
        process.estimatedValue === null || process.estimatedValue === undefined
          ? ""
          : formatEstimatedValueInput(
              process.estimatedValue.toFixed(2).replace(".", ",")
            ),
      estimatedCurrency: process.estimatedCurrency ?? "TRY",
      nextAction: process.nextAction ?? "",
      nextActionDate: process.nextActionDate
        ? String(process.nextActionDate).slice(0, 10)
        : "",
    });
  }, [process]);

  if (!process) {
    return null;
  }

  const handleSave = async () => {
    const isBecomingNegative =
      process.salesStage !== "NEGATIVE" && form.salesStage === "NEGATIVE";

    const negativeReasonNote = form.negativeReasonNote.trim();

    if (isBecomingNegative && !negativeReasonNote) {
      return;
    }

    await onSave({
      payload: {
        salesStage: form.salesStage,
        accountStatus: form.accountStatus,
        estimatedValue: parseEstimatedValueInput(form.estimatedValue),
        estimatedCurrency:
          parseEstimatedValueInput(form.estimatedValue) === null
            ? null
            : form.estimatedCurrency,
        nextAction: form.nextAction.trim() || null,
        nextActionDate: form.nextActionDate || null,
      },
      negativeReasonNote: isBecomingNegative ? negativeReasonNote : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Süreç Detayı</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Firma"
            value={process.accountName}
            fullWidth
            disabled
          />

          <TextField
            label="Sorumlu Kişi"
            value={process.responsibleUserName ?? "-"}
            fullWidth
            disabled
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Son Toplantı Tarihi"
              value={
                process.lastMeetingDate
                  ? new Date(process.lastMeetingDate).toLocaleDateString("tr-TR")
                  : "-"
              }
              fullWidth
              disabled
            />

            <TextField
              label="Son Güncelleme"
              value={
                process.updatedAt
                  ? new Date(process.updatedAt).toLocaleString("tr-TR")
                  : "-"
              }
              fullWidth
              disabled
            />
          </Stack>

          <TextField
            label="Son Not"
            value={process.latestNote ?? "-"}
            fullWidth
            multiline
            minRows={2}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor:
                  process.latestNoteIsNegativeReason
                    ? "#b91c1c"
                    : undefined,
              },
            }}
          />

          <Button
            variant="outlined"
            onClick={() => onOpenNotes(process)}
            sx={{ alignSelf: "flex-start" }}
          >
            Notları Gör
          </Button>

          <Divider />

          <Typography variant="subtitle1" fontWeight={700}>
            Güncelleme Alanları
          </Typography>

          <TextField
            select
            label="Satış Aşaması"
            value={form.salesStage}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                salesStage: event.target.value as SalesStage,
              }))
            }
            fullWidth
          >
            {SALES_STAGE_OPTIONS.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {getSalesStageLabel(stage)}
              </MenuItem>
            ))}
          </TextField>

          {process.salesStage !== "NEGATIVE" && form.salesStage === "NEGATIVE" ? (
            <TextField
              label="Olumsuz Sebebi"
              placeholder="Süreç neden olumsuz kapandı?"
              value={form.negativeReasonNote}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  negativeReasonNote: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={2}
              required
              error={!form.negativeReasonNote.trim()}
              helperText={!form.negativeReasonNote.trim()
                ? "Olumsuz aşamaya alırken not girmek zorunludur."
                : "Bu not süreç notlarına kırmızı olarak eklenecek."}
            />
          ) : null}

          <TextField
            select
            label="Firma Statüsü"
            value={form.accountStatus}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                accountStatus: event.target.value as AccountStatus,
              }))
            }
            fullWidth
          >
            {ACCOUNT_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {getAccountStatusLabel(status)}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Tahmini Satış Değeri"
              value={form.estimatedValue}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedValue: normalizeEstimatedValueInput(event.target.value),
                }))
              }
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  estimatedValue: prev.estimatedValue
                    ? formatEstimatedValueInput(prev.estimatedValue)
                    : "",
                }))
              }
              fullWidth
              slotProps={{
                htmlInput: {
                  inputMode: "decimal",
                },
              }}
              placeholder="0,00"
              sx={{
                "& .MuiInputBase-input": {
                  textAlign: "right",
                },
              }}
            />

            <TextField
              select
              label="Para Birimi"
              value={form.estimatedCurrency}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedCurrency: event.target.value as CurrencyCode,
                }))
              }
              fullWidth
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {CURRENCY_LABELS[currency]}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label="Sonraki Aksiyon"
            value={form.nextAction}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                nextAction: event.target.value,
              }))
            }
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="Sonraki Aksiyon Tarihi"
            type="date"
            value={form.nextActionDate}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                nextActionDate: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button variant="contained" onClick={handleSave}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
