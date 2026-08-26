import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Project {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => String, { nullable: true })
  url!: string | null;

  @Field(() => String, { nullable: true })
  imageUrl!: string | null;

  @Field()
  isPlaceholder!: boolean;

  @Field(() => Int)
  sortOrder!: number;
}
