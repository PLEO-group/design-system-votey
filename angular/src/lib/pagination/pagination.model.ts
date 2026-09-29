export interface PaginationEvent {
  page: number;
  size: number;
  search?: string;
  sort?: string | null;
}

export interface PaginatedList<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  loading?: boolean;
}

export const defaultFetchParams: Readonly<PaginationEvent> = {
  page: 0,
  size: 20,
};

export const noPaginationParams: Readonly<PaginationEvent> = {
  page: 0,
  size: 2147483647,
};

export const emptyPaginatedList: Readonly<PaginatedList<never>> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: defaultFetchParams.size,
  loading: false,
};

export const emptyPaginatedListLoading: Readonly<PaginatedList<never>> = {
  ...emptyPaginatedList,
  loading: true,
};
