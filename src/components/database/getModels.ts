import { openDB } from "../../openDB";

export interface Model {
  model: string;
  count: number;
}

const getModels = async (make: string) => {
  // console.log("make", make);
  const db = await openDB();
  const model = await db.all<Model[]>(
    `SELECT model, count(*) as count
    FROM Car 
    WHERE make= @make
    GROUP BY model`,
    { "@make": make }
  );

  return model;
};

export default getModels;
