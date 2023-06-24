import { Query } from "@/modules/shared/domain/query";

export class LoadShowSeasonEpisodesQuery extends Query<{
  slug: string;
  season: number;
  sort?: "desc" | "asc";
  page?: number;
  limit?: number;
}> {}
