import { gql } from "graphql-request";
import type { Project } from "@my-page/shared-types";
import { graphqlClient } from "../../../shared/api/graphqlClient";

const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      title
      description
      url
      imageUrl
      isPlaceholder
      sortOrder
    }
  }
`;

interface ProjectsQueryResponse {
  projects: Project[];
}

export async function getProjects(): Promise<Project[]> {
  const { projects } = await graphqlClient.request<ProjectsQueryResponse>(PROJECTS_QUERY);
  return projects;
}
