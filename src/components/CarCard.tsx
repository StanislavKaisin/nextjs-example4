import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React from "react";
import { CarModel } from "../../api/Car";
import Link from "next/link";

export interface CarCardProps {
  car: CarModel;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
    anchorTag: { textDecoration: "none" },
  })
);

const CarCard = ({ car }: CarCardProps) => {
  const classes = useStyles();

  return (
    <Link
      href={"/car/[make]/[brand]/[id]"}
      as={`/car/${car.make}/${car.model}/${car.id}`}
    >
      <a className={classes.anchorTag}>
        <Card elevation={5}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                Cars
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={car.make + " " + car.model}
            subheader={"$ " + car.price}
          />
          <CardMedia
            className={classes.media}
            image={car.photoUrl}
            title={car.make + " " + car.model}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {car.details}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default CarCard;
