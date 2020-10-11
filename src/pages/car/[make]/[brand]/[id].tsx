import { GetServerSideProps } from "next";
import React from "react";
import { CarModel } from "../../../../../api/Car";
import { openDB } from "../../../../openDB";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Button } from "@material-ui/core";
import Head from "next/head";

interface CarPageProps {
  car: CarModel | null | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      // maxWidth: "50%",
    },
    img: {
      // margin: "auto",
      // display: "block",
      // maxWidth: "100%",
      // maxHeight: "100%",
      width: "100%",
    },
  })
);

const CarPage = ({ car }: CarPageProps) => {
  const classes = useStyles();
  if (!car) {
    return <h1>Sorry, car not found!</h1>;
  }
  return (
    <div className={classes.root}>
      <Head>
        <title>{car.make + "  " + car.model}</title>
      </Head>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <img
              className={classes.img}
              alt={car.make + "  " + car.model}
              src={car.photoUrl}
            />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                  {car.make + "  " + car.model}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  ${car.price}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Year: {car.year}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Fuel: {car.fuelType}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Kilometers: {car.kilometers}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {car.details}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  // variant="body2"
                  style={{ cursor: "pointer" }}
                >
                  Buy now!
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CarPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id;
  // console.log("id", id);
  const db = await openDB();
  const car = await db.get<CarModel | undefined>(
    "SELECT * FROM Car where id=?",
    id
  );

  return { props: { car: car || null } };
};
