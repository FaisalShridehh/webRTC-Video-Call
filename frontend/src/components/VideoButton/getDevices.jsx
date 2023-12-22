//a utility funciton that fetches all available devices
//both video and audio

const getDevices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      const audioOutputDevices = devices.filter(
        (d) => d.kind === "audiooutput"
      );
      const audioInputDevices = devices.filter((d) => d.kind === "audioinput");
      resolve({
        videoDevices,
        audioOutputDevices,
        audioInputDevices,
      });
    } catch (error) {
      console.error("[getDevices] Error:", error);
      reject(error);
    }
  });
};

export default getDevices;
