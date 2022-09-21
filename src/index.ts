import express, { Application } from "express";
const axios = require("axios");
import * as turf from "@turf/turf";
const districts = require("../data/formatted-districts.json");
import { MAPBOX_API_URL } from "./constants";
import { MapboxResponse, PlaceFeature } from "./types";

require("dotenv").config();

const app: Application = express();

app.get("/decode", async (req, res) => {
  const address = req.query?.address;
  if (!address) {
    res.send({
      message: "An address is missing",
    });
  }

  try {
    // call maps
    const mapBoxResponse: MapboxResponse = await axios.get(
      `${MAPBOX_API_URL}/${address}.json?proximity=ip&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
    );
    const place: PlaceFeature = mapBoxResponse.data.features[0];

    //call lib
    const point = turf.point(place.geometry.coordinates);
    let districtName: string | undefined;

    districts.features.every((districtObj) => {
      const poly = turf.polygon(districtObj.geometry.coordinates);
      const isInDiscrict = turf.booleanPointInPolygon(point, poly);

      if (isInDiscrict) {
        districtName = districtObj.properties.Name;
        return false;
      }
      return true;
    });

    if (!districtName) {
      res.send({
        status: "Discrict was not found",
        search: address,
      });
    }

    //cal the response
    res.send({
      status: "ok",
      search: address,
      serviceArea: districtName,
      address: place.place_name,
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    });
  } catch (err: any) {
    res.send({
      message: `${err.response?.status} - ${err.response?.statusText}`,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
