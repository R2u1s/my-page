import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FaPhone, FaEnvelope, FaTelegram, FaTimes } from "react-icons/fa";
import { profile } from "../../../entities/profile";

interface ContactsDialogProps {
  open: boolean;
  onClose: () => void;
}

const CONTACT_ITEMS = [
  { icon: FaPhone, text: profile.phone },
  { icon: FaEnvelope, text: profile.email },
  { icon: FaTelegram, text: profile.telegram },
];

export function ContactsDialog({ open, onClose }: ContactsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Контакты
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ py: 1 }}>
          {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
            <Stack key={text} direction="row" spacing={2} alignItems="center">
              <Icon size={20} />
              <Typography>{text}</Typography>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
