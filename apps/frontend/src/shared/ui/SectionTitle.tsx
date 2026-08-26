import type { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

export function SectionTitle(props: TypographyProps) {
  return <StyledTitle variant="h4" component="h2" {...props} />;
}
