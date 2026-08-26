import { useEffect, useRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { visitCounter, useIncrementVisitCounter } from "../../../entities/visit-counter";
import { SectionContainer } from "../../../shared/ui/SectionContainer";

export function VisitCounterSection() {
  const { mutate, data, isError } = useIncrementVisitCounter();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) {
      return;
    }
    hasRequested.current = true;
    mutate();
  }, [mutate]);

  return (
    <SectionContainer component="footer" sx={{ paddingTop: 2, paddingBottom: 4 }}>
      <Stack alignItems="center" spacing={0.5}>
        {data && !isError && (
          <Typography variant="h6" color="text.secondary">
            {data.count}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {visitCounter.label}
        </Typography>
      </Stack>
    </SectionContainer>
  );
}
