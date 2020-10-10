import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from "@material-ui/lab";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { getAsString } from "../getAsString";
import Link from "next/link";

interface CarPaginationProps {
  totalPages: number;
  query: ParsedUrlQuery;
}

const CarPagination = ({ totalPages, query }: CarPaginationProps) => {
  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUILink}
          item={item}
          query={query}
          {...item}
        />
      )}
    />
  );
};

export default CarPagination;

export interface MaterialUILinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export const MaterialUILink = React.forwardRef<
  HTMLAnchorElement,
  MaterialUILinkProps
>(({ item, query, ...props }, ref) => {
  return (
    <Link
      href={{ pathname: "/cars", query: { ...query, page: item.page } }}
      shallow
    >
      <a ref={ref} {...props}></a>
    </Link>
  );
});
