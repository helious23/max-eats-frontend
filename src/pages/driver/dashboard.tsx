import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { gql, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { Link } from "react-router-dom";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

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
  const [map, setMap] = useState<google.maps.Map>();
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
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      /* client login 시 header 에 주소 보여주기, owner login 시 restaurant 선택 시 주소 보여주기
      const geocoder = new google.maps.Geocoder(); // coods 로 주소 검색
      // geocoder.geocode(
      //   {
      //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //   },
      //   (results, status) => {
      //     console.log(status, results);
      //   }
       );
       */
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#65A20C",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.02
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING, // 국내는 TRANSIT 만 지원 가능
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  });

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
          draggable={true}
          defaultCenter={{ lat: 35.2084852, lng: 129.0829893 }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>

      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <div>
            <div className="text-center text-3xl font-medium">새로운 주문</div>
            <div className="text-center my-3 text-xl font-medium">
              <Link
                to={`/restaurant/${cookedOrdersData?.cookedOrders.restaurant?.id}`}
              >
                {cookedOrdersData?.cookedOrders.restaurant?.name}
              </Link>
              에서 주문을 픽업하세요!
            </div>

            <Link
              to={`/orders/${cookedOrdersData?.cookedOrders.id}`}
              className="btn w-full mt-5 block text-center"
            >
              주문 픽업하러 가기 &rarr;
            </Link>
          </div>
        ) : (
          <div className="text-center text-2xl font-medium">
            아직 픽업 가능한 주문이 없습니다...
          </div>
        )}
      </div>
    </div>
  );
};
