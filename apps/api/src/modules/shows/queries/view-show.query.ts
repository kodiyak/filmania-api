import { Query } from "@/modules/shared/domain/query";

export class ViewShowQuery extends Query<{
  slug: string;
}> {}
