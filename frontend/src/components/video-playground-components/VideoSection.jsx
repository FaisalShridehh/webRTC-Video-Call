export default function VideoSection({
  localStreamRef,
  isThereRecord,
  isThereScreenRecord,
  recordedStreamRef,
  screenRecordedStreamRef,
}) {
  return (
    <>
      <div>
        <div className="flex flex-wrap gap-2">
          <div>
            <h3>My feed</h3>
            <video
              id="my-video"
              className="video bg-[#333] p-5 rounded-xl text-white text-4xl h-[40vh]"
              autoPlay
              playsInline
              ref={localStreamRef}
              // muted
            ></video>
          </div>
          <div className="flex flex-wrap flex-col gap-3">
            <h3>Records Section</h3>
            {isThereRecord ? (
              <video
                id="recorded-video"
                className="video bg-[#333] p-5 rounded-xl text-white text-4xl h-[35vh]"
                autoPlay
                playsInline
                ref={recordedStreamRef}
                // muted
              ></video>
            ) : (
              <></>
            )}
            {isThereScreenRecord ? (
              <video
                id="recorded-video"
                className="video bg-[#333] p-5 rounded-xl text-white text-4xl h-[35vh]"
                autoPlay
                playsInline
                ref={screenRecordedStreamRef}
                // muted
              ></video>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3>Their feed</h3>
        <video
          id="other-video"
          className="video bg-[#333] p-5 rounded-xl text-white text-4xl h-[40vh]"
          autoPlay
          playsInline
        ></video>
      </div>
    </>
  );
}
