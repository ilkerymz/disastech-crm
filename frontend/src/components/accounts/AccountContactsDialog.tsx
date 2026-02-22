import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
} from "@mui/material";

import ContactList from "../contacts/ContactList";
import type { Account } from "../../types/account";

interface Props {
  open: boolean;
  account: Account | null;
  onClose: () => void;
}

export default function AccountContactsDialog({
  open,
  account,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Firma Kişileri{account ? ` — ${account.name}` : ""}
      </DialogTitle>
      <DialogContent>
        {account ? (
          <ContactList accountId={account.id} />
        ) : (
          <Box py={2}>
            <Typography variant="body2" color="text.secondary">
              Firma bulunamadı.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
