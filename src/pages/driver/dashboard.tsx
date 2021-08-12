import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBwJ4CnPrPH-Gd8LlzgtF-WwUP9RHMkYVA" }}
          defaultZoom={20}
          defaultCenter={{ lat: 59.95, lng: 30.33 }}
        >
          <h1>Hello google map</h1>
        </GoogleMapReact>
      </div>
    </div>
  );
};
