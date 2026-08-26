import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { ProjectInfo } from "../model/config";

interface ProjectCardProps {
  project: ProjectInfo;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const media = project.imageUrl && (
    <CardMedia
      component="img"
      height="320"
      image={project.imageUrl}
      alt={project.title}
      sx={{ objectFit: "contain" }}
    />
  );

  const content = (
    <CardContent>
      <Typography variant="h6" component="h3" gutterBottom>
        {project.title}
      </Typography>
      {project.description && (
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
      )}
    </CardContent>
  );

  if (project.isPlaceholder || !project.url) {
    return (
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          opacity: 0.6,
          borderStyle: "dashed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {media}
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom={Boolean(project.description)}>
            {project.title}
          </Typography>
          {project.description && (
            <Typography variant="body2" color="text.secondary">
              {project.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component="a"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ height: "100%", alignItems: "flex-start", display: "block" }}
      >
        {media}
        {content}
      </CardActionArea>
    </Card>
  );
}
