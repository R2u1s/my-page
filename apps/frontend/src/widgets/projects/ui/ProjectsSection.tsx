import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useProjects, ProjectCard } from "../../../entities/project";
import { SectionContainer } from "../../../shared/ui/SectionContainer";
import { SectionTitle } from "../../../shared/ui/SectionTitle";

export function ProjectsSection() {
  const { data: projects, isPending, isError } = useProjects();

  return (
    <SectionContainer component="section" id="projects">
      <SectionTitle>Проекты</SectionTitle>

      {isPending && (
        <Grid container spacing={3}>
          {[1, 2].map((key) => (
            <Grid item key={key} xs={12} sm={6}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && (
        <Alert severity="info">
          Не удалось загрузить список проектов. Попробуйте обновить страницу позже.
        </Alert>
      )}

      {!isPending && !isError && projects && projects.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Список проектов пока пуст.
        </Typography>
      )}

      {!isPending && !isError && projects && projects.length > 0 && (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item key={project.id} xs={12} sm={6}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </SectionContainer>
  );
}
