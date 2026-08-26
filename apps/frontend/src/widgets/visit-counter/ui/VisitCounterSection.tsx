import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visitCounter } from "../../../entities/visit-counter";
import { SectionContainer } from "../../../shared/ui/SectionContainer";

export function VisitCounterSection() {
  return (
    <SectionContainer component="footer" sx={{ paddingTop: 2, paddingBottom: 4 }}>
      <Stack alignItems="center" spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {visitCounter.count}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {visitCounter.label}
        </Typography>
      </Stack>
    </SectionContainer>
  );
}
