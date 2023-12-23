import moment from "moment";
import { useEffect, useState } from "react";

function CallInfo({ apptData }) {
  const [momentText, setMomentText] = useState(
    moment(apptData.date).fromNow()
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setMomentText(moment(apptData.date).fromNow());
      // console.log("Updating time");
    }, 5000);
    return () => {
      // console.log("Clearing");
      clearInterval(timeInterval);
    };
  }, [apptData.date]);

  return (
    <div className="call-info absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#cacaca] bg-[#222] p-2.5 text-white ">
      <h1>
        {apptData.fullName} has been notified.
        <br />
        Your appointment is {momentText}.
      </h1>
    </div>
  );
}

export default CallInfo;
