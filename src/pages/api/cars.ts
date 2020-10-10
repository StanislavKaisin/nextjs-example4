import { NextApiRequest, NextApiResponse } from "next";
import getModels from "../../components/database/getModels";
import getPaginatedCars from "../../components/database/getPaginatedCars";
import { getAsString } from "../../getAsString";

export default async function cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPaginatedCars(req.query);
  res.json(cars);
}
