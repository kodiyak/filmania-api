import { Query } from "@/modules/shared/domain/query";

export class LoadShowSeasonsQuery extends Query<{
  slug: string;
  maxEpisodes?: number;
}> {}
