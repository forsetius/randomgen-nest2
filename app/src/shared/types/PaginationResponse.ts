export interface PaginationResponse<TData> {
  items: TData[];
  totalItems: number;
  page: number;
  itemsPerPage: number;
}
