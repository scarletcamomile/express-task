export type Coordinate = Array<number>;

type Geometry = {
   type: string;
   coordinates: Array<Coordinate>
};

type Property = {
   Description: string,
   Name: string;
};

export type DistrictDescription = {
   type: string;
   geometry: Geometry;
   properties: Property;
};

type GeomatryResponseObject = {
   coordinates: Array<number>;
   type: string;
}

export type PlaceFeature = {
   id: string;
   type: string;
   text: string;
   place_name: string;
   geometry: GeomatryResponseObject;
}

type MapboxResponseDataObject = {
   type: string;
   features: Array<PlaceFeature>;
   query: Array<string>;
   attribution: string;
};

export type MapboxResponse = {
   data: MapboxResponseDataObject;
};
