import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class VisitCounter {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  count!: number;
}
