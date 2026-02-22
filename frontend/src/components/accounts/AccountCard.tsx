import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAccount } from "../../api/account.api";
import type { Account } from "../../types/account";
import ContactList from "../contacts/ContactList";
import { getAccountStatusLabel } from "../../constants/accountStatus";

interface Props {
  account: Account;
}

export default function AccountCard({ account }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">{account.name}</Typography>
          <IconButton
            size="small"
            onClick={() => deleteMutation.mutate(account.id)}
            disabled={deleteMutation.isPending}
            aria-label="Hesabı sil"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Durum: {getAccountStatusLabel(account.status)}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <ContactList accountId={account.id} />
      </CardContent>
    </Card>
  );
}
