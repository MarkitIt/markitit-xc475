declare module "node-geocoder" {
  export interface Options {
    provider: string;
    apiKey?: string;
    formatter?: any;
    language?: string;
    [key: string]: any;
  }

  export interface GeocoderResult {
    latitude?: number;
    longitude?: number;
    country?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    zipcode?: string;
    streetName?: string;
    streetNumber?: string;
    countryCode?: string;
    provider?: string;
    formattedAddress?: string;
    [key: string]: any;
  }

  export default function NodeGeocoder(options: Options): {
    geocode(address: string): Promise<GeocoderResult[]>;
    batchGeocode(
      addresses: string[],
    ): Promise<Array<{ error: Error | null; value: GeocoderResult[] }>>;
    reverse(lat: number, lon: number): Promise<GeocoderResult[]>;
  };
}
