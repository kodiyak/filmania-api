import { Query } from "@/modules/shared/domain/query";

export class LoadShowSeasonsQuery extends Query<{
  slug: string;
  type: string;
  maxEpisodes?: number;
}> {}
