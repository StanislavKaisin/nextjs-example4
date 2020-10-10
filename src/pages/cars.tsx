import { Grid } from "@material-ui/core";
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

interface carsProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
  serverQuery: ParsedUrlQuery;
}

const cars = ({ makes, models, cars, totalPages }: carsProps) => {
  const { query } = useRouter();
  // console.log("query.page", query.page);
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
      <Grid item xs={12} sm={12} md={6} lg={8}>
        <CarPagination totalPages={totalPages} query={query} />
        {/* <pre style={{ fontSize: "1rem" }}> */}
        {/* {JSON.stringify({ totalPages, cars }, null, 2)} */}
        {/* {JSON.stringify(data, null, 2)} */}
        {/* </pre> */}
        {cars.map((car) => {
          return <CarCard car={car} key={car.id} />;
        })}
        <CarPagination totalPages={totalPages} query={query} />
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
  // console.log("pagination", pagination);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
      serverQuery: ctx.query,
    },
  };
};
