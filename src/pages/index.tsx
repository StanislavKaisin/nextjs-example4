import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
} from "@material-ui/core";
import { SelectProps } from "@material-ui/core/Select/Select";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
// import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
// import styles from "../../styles/Search.module.css";
import getMakes, { Make } from "../components/database/getMakes";
import getModels, { Model } from "../components/database/getModels";
import { getAsString } from "../getAsString";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    paper: {
      margin: "auto",
      maxWidth: 500,
      padding: theme.spacing(3),
    },
  })
);

interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const prices = [500, 1000, 5000, 15000, 25000, 50000];

export default function Search({ makes, models, singleColumn }: SearchProps) {
  const router = useRouter();
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;
  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        router.push(
          { pathname: "/cars", query: { ...values, page: 1 } },
          undefined,
          { shallow: true }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel id="searchMake">Make</InputLabel>
                  <Field
                    as={Select}
                    labelId="searchMake"
                    label="Make"
                    name="make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => {
                      return (
                        <MenuItem
                          value={make.make}
                          key={make.make}
                        >{`${make.make} (${make.count})`}</MenuItem>
                      );
                    })}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect make={values.make} name="model" models={models} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel id="searchMinPrice">Min.Price</InputLabel>
                  <Field
                    as={Select}
                    labelId="searchMinPrice"
                    label="MinPrice"
                    name="minPrice"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price) => {
                      return (
                        <MenuItem
                          value={price}
                          key={price}
                        >{`$ ${price}`}</MenuItem>
                      );
                    })}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel id="searchMaxPrice">Max.Price</InputLabel>
                  <Field
                    as={Select}
                    labelId="searchMaxPrice"
                    label="MaxPrice"
                    name="maxPrice"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price) => {
                      return (
                        <MenuItem
                          value={price}
                          key={price}
                        >{`$ ${price}`}</MenuItem>
                      );
                    })}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ make, models, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const classes = useStyles();
  const [field] = useField({ name: props.name });
  const { data } = useSWR<Model[]>("/api/models?make=" + make, {
    dedupingInterval: 60000,
    // onSuccess: (newValues) => {
    //   if (!newValues.map((value) => value.model).includes(field.value)) {
    //     // we want to make this field.value = 'All'
    //     setFieldValue("model", "all");
    //   }
    // },
  });
  const newModels = data || models;
  useEffect(() => {
    if (!newModels?.map((a) => a.model).includes(field.value)) {
      setFieldValue("model", "all");
    }
  }, [make, newModels]);
  return (
    <FormControl variant="outlined" className={classes.formControl} fullWidth>
      <InputLabel id="searchModel">Model</InputLabel>
      <Select
        labelId="searchModel"
        label="Model"
        name="model"
        {...props}
        {...field}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => {
          return (
            <MenuItem
              value={model.model}
              key={model.model}
            >{`${model.model} (${model.count})`}</MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  // const makes = await getMakes();
  // const models = await getModels(make);
  return { props: { makes, models } };
};
