import { Link } from "react-router-dom";
export default function Home() {
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
    </div>
  );
}
