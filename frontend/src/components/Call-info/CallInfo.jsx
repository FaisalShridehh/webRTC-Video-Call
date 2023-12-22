import moment from "moment";
import { useEffect, useState } from "react";

function CallInfo({ tokenLinkInfo }) {
  const [momentText, setMomentText] = useState(
    moment(tokenLinkInfo.date).fromNow()
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setMomentText(moment(tokenLinkInfo.date).fromNow());
      // console.log("Updating time");
    }, 5000);
    return () => {
      // console.log("Clearing");
      clearInterval(timeInterval);
    };
  }, [tokenLinkInfo.date]);

  return (
    <div className="call-info absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#cacaca] bg-[#222] p-2.5 text-white ">
      <h1>
        {tokenLinkInfo.fullName} has been notified.
        <br />
        Your appointment is {momentText}.
      </h1>
    </div>
  );
}

export default CallInfo;
