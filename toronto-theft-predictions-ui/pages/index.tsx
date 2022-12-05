import Head from "next/head";
import styles from "../styles/Home.module.css";
import Map from "../components/Map";
import { useState } from "react";
import hoodNames from "../data/hood_map.json";
import { hoodTransform } from "../lib/hoodTransform";

export default function Home() {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [prediction, setPrediction] = useState([]);
  const [hoodID, setHoodID] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get the neighbourhood name from the coordinates using the Google Maps API
  const getNeighbourhood = async () => {
    if (loading) return;

    setLoading(true);

    // Fetch /api/hood with the coordinates as query parameters
    const res = await fetch(
      `https://hood-vh6axfb7dq-uc.a.run.app/?lat=${coordinates.lat}&lng=${coordinates.lng}`
    );
    const hood_id = await res.text();

    setHoodID(hoodTransform(Number(hood_id)));

    // Check if prediction is empty
    if (prediction.length == 0) {
      // Fetch predictions from cloud function
      const res = await fetch(`https://predictionsv1-vh6axfb7dq-uc.a.run.app`);
      const data = await res.json();
      setPrediction(data);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Group 4 - UofT - ML</title>
        <meta name="description" content="ML UOFT - theft prediction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Create a fill page loader component animation that displays when the state is loading */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center opacity-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        <Map setCoordinates={setCoordinates} />

        {/* Create a button centered to the middle with tailwind js */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 px-10"
            onClick={getNeighbourhood}
          >
            Predict
          </button>
        </div>

        {/* Create a card component that displays the prediction */}
        {prediction.length != 0 && hoodID != 0 && (
          <div className="max-w-sm rounded overflow-hidden shadow-lg mt-4 text-center">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Prediction</div>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                {hoodNames[hoodID]} - {prediction[hoodID]["thefts"]} thefts
                today
              </p>
              <p className="mt-4">
                There&apos;s a predicted number of thefts in Toronto today of:
              </p>
              <p>{prediction.reduce((a, b) => a + b.thefts, 0)}</p>
              <p>In the following neighbourhoods:</p>
              <p>
                {prediction
                  .map((e, i) => ({
                    thefts: e.thefts,
                    index: i,
                    name: hoodNames[i],
                  }))
                  .filter((e) => e.thefts)
                  .map((e) => e.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
