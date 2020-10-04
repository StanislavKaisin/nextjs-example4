import { openDB } from "../../openDB";

export interface Make {
  make: string;
  count: number;
}

const getMakes = async () => {
  const db = await openDB();
  const makes = await db.all<Make[]>(
    `SELECT make, count(*) as count
    FROM Car 
    GROUP BY make`
  );

  return makes;
};

export default getMakes;
