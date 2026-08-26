import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import { profile } from "../../../entities/profile";
import { SectionContainer } from "../../../shared/ui/SectionContainer";
import { ContactsDialog } from "./ContactsDialog";

export function HeroSection() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "transparent",
        color: "text.primary",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <SectionContainer
        component="div"
        sx={{
          py: "0 !important",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 4 }}
          alignItems={{ xs: "center", md: "flex-end" }}
          justifyContent="space-between"
          sx={{ width: "100%", minHeight: "100dvh" }}
        >
          {/* Left Content Column - Centered vertically on screen height */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignSelf: "center",
              py: { xs: 8, md: 0 },
              zIndex: 2,
              position: "relative",
            }}
          >
            {/* Info Group with vertical left accent bar */}
            <Box
              sx={(theme) => ({
                borderLeft: `2px solid ${alpha(theme.palette.common.white, 0.35)}`,
                pl: { xs: 2.5, md: 3.5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              })}
            >
              <Typography
                component="h1"
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "2.2rem", sm: "3.2rem", md: "3.8rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "common.white",
                  whiteSpace: "nowrap",
                }}
              >
                {profile.firstName} {profile.lastName}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={(theme) => ({
                  mt: 1.5,
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.35rem" },
                  fontWeight: 300,
                  color: alpha(theme.palette.common.white, 0.7),
                  textTransform: "lowercase",
                  letterSpacing: "0.02em",
                })}
              >
                {profile.profession}
              </Typography>

              {/* Contact Button */}
              <Button
                variant="outlined"
                onClick={() => setContactsOpen(true)}
                sx={(theme) => ({
                  mt: 4,
                  px: 4,
                  py: 1,
                  borderRadius: "50px",
                  borderColor: theme.palette.accent.main,
                  color: "common.white",
                  textTransform: "lowercase",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                  borderWidth: "1px",
                  "&:hover": {
                    borderColor: theme.palette.accent.light,
                    backgroundColor: alpha(theme.palette.accent.main, 0.12),
                  },
                })}
              >
                {profile.contactLabel}
              </Button>
            </Box>
          </Box>

          {/* Right Column - Photo (Black & White) */}
          {!photoFailed && (
            <Box
              sx={{
                flex: { md: "0 0 60%" },
                maxWidth: { md: "60%" },
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "flex-end",
                alignSelf: "flex-end",
                lineHeight: 0,
                zIndex: 1,
              }}
            >
              <Box
                component="img"
                src={profile.photoUrl}
                alt={profile.photoAlt}
                onError={() => setPhotoFailed(true)}
                sx={{
                  width: "auto",
                  maxWidth: "none",
                  maxHeight: { xs: "100vh", md: "160vh" },
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "top center",
                  borderRadius: { xs: 2, md: 0 },
                  display: "block",
                  filter: "grayscale(100%) contrast(105%)",
                  transform: { xs: "scale(1.5)", md: "translateX(150px) scale(0.8)" },
                  transformOrigin: { xs: "bottom center", md: "bottom right" },
                }}
              />
            </Box>
          )}
        </Stack>
      </SectionContainer>

      <ContactsDialog open={contactsOpen} onClose={() => setContactsOpen(false)} />
    </Box>
  );
}
