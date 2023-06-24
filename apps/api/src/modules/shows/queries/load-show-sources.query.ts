import { Query } from "@/modules/shared/domain/query";

export class LoadShowSourcesQuery extends Query<{
  slug: string;
  season?: number;
  episode?: number;
}> {}
