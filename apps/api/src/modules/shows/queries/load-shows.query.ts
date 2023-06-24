import { Query } from "@/modules/shared/domain/query";

export class LoadShowsQuery extends Query<{
  page?: number;
  limit?: number;
  query?: string;
  type?: string;
}> {}
