import { ParsedUrlQuery } from "querystring";
import { CarModel } from "../../../api/Car";
import { getAsString } from "../../getAsString";
import { openDB } from "../../openDB";

const mainQuery = `
  WHERE (@make is NULL OR @make = make)
  AND (@model is NULL OR @model = model)
  AND (@minPrice is NULL OR @minPrice <= price)
  AND (@maxPrice is NULL OR @maxPrice >= price)
`;

const getPaginatedCars = async (query: ParsedUrlQuery) => {
  const db = await openDB();

  const page = getValueNumber(query.page) || 1;
  const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
  const offset = (page - 1) * rowsPerPage;

  const dbParams = {
    "@make": getValueString(query.make),
    "@model": getValueString(query.model),
    "@minPrice": getValueNumber(query.minPrice),
    "@maxPrice": getValueNumber(query.maxPrice),
  };
  const carsPromise = db.all<CarModel[]>(
    `SELECT * FROM Car ${mainQuery} LIMIT @rowsPerPage OFFSET @offset`,
    { ...dbParams, "@rowsPerPage": rowsPerPage, "@offset": offset }
  );
  const totalRowsPromise = db.get<{ count: number }>(
    `SELECT COUNT(*) as count FROM Car ${mainQuery}`,
    { ...dbParams }
  );
  const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);
  return { cars, totalPages: Math.ceil(totalRows.count / rowsPerPage) };
};

export default getPaginatedCars;

function getValueString(value: string | string[]) {
  const str = getAsString(value);
  return !str || str.toLowerCase() === "all" ? null : str;
}

function getValueNumber(value: string | string[]) {
  const str = getAsString(value);
  const number = parseInt(str);
  return isNaN(number) ? null : number;
}
