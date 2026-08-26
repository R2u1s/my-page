import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const SectionContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },
})) as typeof Box;
