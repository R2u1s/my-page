import { gql } from "graphql-request";
import type { VisitCounter } from "@my-page/shared-types";
import { graphqlClient } from "../../../shared/api/graphqlClient";

const INCREMENT_VISIT_COUNT_MUTATION = gql`
  mutation IncrementVisitCount {
    incrementVisitCount {
      id
      count
    }
  }
`;

interface IncrementVisitCountMutationResponse {
  incrementVisitCount: VisitCounter;
}

export async function incrementVisitCounter(): Promise<VisitCounter> {
  const { incrementVisitCount } = await graphqlClient.request<IncrementVisitCountMutationResponse>(
    INCREMENT_VISIT_COUNT_MUTATION,
  );
  return incrementVisitCount;
}
