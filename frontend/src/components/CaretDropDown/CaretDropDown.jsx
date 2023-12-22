import PropTypes from "prop-types";
export default function CaretDropDown({
  defaultValue,
  changeHandler,
  deviceList,
  type,
}) {
  const generateOptions = (list, keyPrefix = "") => {
    return list.map((item) => (
      <option
        key={`${keyPrefix}${item.deviceId}`}
        value={`${keyPrefix}${item.deviceId}`}
      >
        {item.label}
      </option>
    ));
  };

  let dropDownEl;

  if (type === "video") {
    dropDownEl = generateOptions(deviceList);
  } else if (type === "audio") {
    const audioInputEl = generateOptions(
      deviceList.filter((d) => d.kind === "audioinput"),
      "input"
    );
    const audioOutputEl = generateOptions(
      deviceList.filter((d) => d.kind === "audiooutput"),
      "output"
    );
    dropDownEl = [
      <optgroup key="inputGroup" label="Input Devices">
        {audioInputEl}
      </optgroup>,
      <optgroup key="outputGroup" label="Output Devices">
        {audioOutputEl}
      </optgroup>,
    ];
  }

  return (
    <div className="caret-dropdown absolute -top-8">
      <select defaultValue={defaultValue} onChange={changeHandler}>
        {dropDownEl}
      </select>
    </div>
  );
}

CaretDropDown.propTypes = {
  defaultValue: PropTypes.any,
  changeHandler: PropTypes.any,
  deviceList: PropTypes.any,
  type: PropTypes.any,
};
