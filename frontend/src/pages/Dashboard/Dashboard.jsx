import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import createSocketConnection from "../../../webRTCUtilitis/socketConnection";
import proSocketListeners from "../../../webRTCUtilitis/proSocketListeners";
import { useDispatch } from "react-redux";

import moment from "moment";

const BaseBackendURL = "http://localhost:3000/";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apptData, setApptData] = useState([]);

  const dispatch = useDispatch();

  // grab the token query string
  useEffect(() => {
    const token = searchParams.get("token");
    // console.log("searchParams => ", searchParams);
    // console.log("token => ", token);
    const socket = createSocketConnection(token);

    proSocketListeners.proDashboardSocketListeners(
      socket,
      setApptData,
      dispatch
    );

    // fetch decoded token to validate it
    // async function fetchDecodedToken() {
    //   try {
    //     const response = await axios.post(`${BaseBackendURL}validate-link`, {
    //       token,
    //     });
    //     // console.log(response.data);
    //     setApptData(response.data.decodeData);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // fetchDecodedToken();
  }, [dispatch, searchParams]);

  async function joinCall(Appointment) {
    console.log(Appointment);

    const token = searchParams.get("token");
    // navigate to /room-video
    navigate(
      `/pro-video-room?token=${token}&uuid=${Appointment.uuid}&client=${Appointment.clientName}`
    );
  }
  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex flex-[12]  main-border bg-zinc-700 mt-3 h-[50px] rounded-[10px_0_0]"></div>
      </div>
      <div className="flex h-screen">
        <div className="flex-[3] bg-zinc-700 left-rail text-center h-[85vh]">
          <i className="fa fa-user mb-3 text-center text-6xl border rounded-[50%] p-7 text-white"></i>
          <div className="menu-item py-5 px-0 my-0 -mx-3 hover:bg-green-500/90 bg-green-500 active cursor-pointer">
            <li className=" list-none text-left w-[60%] m-auto text-2xl text-white">
              <i className="fa fa-table-columns mr-3"></i>Dashboard
            </li>
          </div>
        </div>
        <div className="flex-[8] p-4 bg-red-900 text-white h-[85vh]">
          <div className="flex flex-col h-full">
            <h1 className="text-4xl ">Dashboard</h1>
            <div className="flex num-1 h-full gap-4 mt-4">
              <div className="flex-[6]  ">
                <div
                  className="dash-box text-white p-3 clients-board rounded-xl h-full overflow-y-scroll  bg-gray-900 
               scroll-smooth
                "
                >
                  <h4 className="text-2xl font-bold">Clients</h4>
                  <li className="client list-none">Person with no name</li>
                </div>
              </div>
              <div className="flex-[6]">
                <div className="dash-box text-white px-4 py-2 clients-board rounded-xl h-full overflow-y-scroll bg-zinc-900">
                  <h4 className="text-2xl font-bold">Coming Appointments</h4>
                  {apptData.map((data) => (
                    <li
                      className="client list-none flex items-center gap-4 "
                      key={data.uuid}
                    >
                      {data.clientName} - {moment(data.apptDate).calendar()}
                      {data.waiting ? (
                        <>
                          <div className="waiting-text inline-block text-2xl text-red-600 hover:bg-red-600/40">
                            Waiting
                          </div>
                          <button
                            className="px-4 py-2 bg-red-500 join-btn ml-3"
                            onClick={() => joinCall(data)}
                          >
                            Join
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
