import { Grid, Paper, Typography } from "@material-ui/core";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Search from ".";
import { CarModel } from "../../api/Car";
import getMakes, { Make } from "../components/database/getMakes";
import getModels, { Model } from "../components/database/getModels";
import getPaginatedCars from "../components/database/getPaginatedCars";
import { getAsString } from "../getAsString";

import { useRouter } from "next/router";
import { ParsedUrlQuery, stringify } from "querystring";

import useSWR from "swr";

import deepEqual from "fast-deep-equal";
import CarPagination from "../components/CarPagination";
import CarCard from "../components/CarCard";
import { Skeleton } from "@material-ui/lab";

interface carsProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
  serverQuery: ParsedUrlQuery;
  loading: boolean;
}

const cars = ({ makes, models, cars, totalPages, loading }: carsProps) => {
  const { query } = useRouter();
  // console.log("loading", loading);
  const [serverQuery] = useState(query);
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });

  // console.log("data", data);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <Search makes={makes} models={models} singleColumn />
      </Grid>
      {data?.totalPages ? (
        <Grid item xs={12} sm={12} md={6} lg={8} container spacing={5}>
          <Grid item xs={12}>
            <CarPagination totalPages={data?.totalPages} query={query} />
          </Grid>
          {(data?.cars || []).map((car) => {
            return (
              <Grid item xs={12} sm={6} key={car.id}>
                <CarCard car={car} />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <CarPagination totalPages={data?.totalPages} query={query} />
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} sm={12} md={6} lg={8} container spacing={5}>
          <Typography variant="h4">No such cars</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default cars;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  let loading = true;
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  loading = false;
  // console.log("pagination", pagination);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
      serverQuery: ctx.query,
      loading,
    },
  };
};
