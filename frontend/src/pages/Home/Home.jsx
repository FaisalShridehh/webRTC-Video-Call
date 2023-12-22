import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      try {
        const res = await axios.get(`http://localhost:3000/user-link`);
        // console.log(res);
        setToken(res.data.token);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, []);

  return (
    <div className="flex flex-col gap-3 justify-center items-center w-screen h-screen">
      <h1 className="text-3xl">Home Page</h1>
      <Link
        to="/video-playground"
        className="p-2 bg-green-700 text-white rounded-md hover:bg-green-500"
      >
        Go To The Video PlayGround Page
      </Link>
      <Link
        to="/peer-connection"
        className="p-2 bg-green-700 text-white rounded-md hover:bg-green-500"
      >
        Go to Stream a Video
      </Link>
      <Link
        to={`/video-room/?token=${token}`}
        className="p-2 bg-green-700 text-white rounded-md hover:bg-green-500"
      >
        Go to a Room Video
      </Link>
    </div>
  );
}
