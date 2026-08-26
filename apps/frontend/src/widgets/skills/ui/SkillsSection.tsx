import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { skillsContent } from "../../../entities/skill";
import { SectionContainer } from "../../../shared/ui/SectionContainer";
import { SectionTitle } from "../../../shared/ui/SectionTitle";

export function SkillsSection() {
  return (
    <SectionContainer component="section">
      <SectionTitle>Навыки</SectionTitle>

      <Stack spacing={2} sx={{ maxWidth: 720, mb: 5 }}>
        {skillsContent.summary.map((paragraph) => (
          <Typography key={paragraph} color="text.secondary">
            {paragraph}
          </Typography>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {skillsContent.stack.map((skill) => {
          const Icon = skill.icon;
          return (
            <Paper
              key={skill.name}
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.25,
                backgroundColor: "background.paper",
              }}
            >
              <Box component={Icon} sx={{ fontSize: 24, color: skill.color }} />
              <Typography variant="body2">{skill.name}</Typography>
            </Paper>
          );
        })}
      </Stack>
    </SectionContainer>
  );
}
