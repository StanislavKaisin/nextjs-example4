import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import React from "react";
import Search from ".";
import { CarModel } from "../../api/Car";
import getMakes, { Make } from "../components/database/getMakes";
import getModels, { Model } from "../components/database/getModels";
import getPaginatedCars from "../components/database/getPaginatedCars";
import { getAsString } from "../getAsString";

import { MemoryRouter, Route } from "react-router";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { useRouter } from "next/router";

interface carsProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

const cars = ({ makes, models, cars, totalPages }: carsProps) => {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Search makes={makes} models={models} singleColumn />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={8}>
        <pre style={{ fontSize: "1rem" }}>
          <Pagination
            page={getAsString(query.page)}
            count={10}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/inbox${item.page === 1 ? "" : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
          {JSON.stringify({ totalPages, cars }, null, 2)}
        </pre>
      </Grid>
    </Grid>
  );
};

export default cars;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
