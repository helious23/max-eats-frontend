import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-3xl">🏍</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();

  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{ key: "AIzaSyAPQD5o2tatgu08e3qQn9E2_7SmJ_w0jVg" }}
          defaultZoom={17}
          draggable={false}
          defaultCenter={{ lat: 35.2084852, lng: 129.0829893 }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
    </div>
  );
};
