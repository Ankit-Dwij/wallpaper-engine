import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

export const getColumnsCount = () => {
  console.log("deviceWidth -- ", deviceWidth);
  if (deviceWidth >= 1024) {
    // desktop
    return 4;
  } else if (deviceWidth >= 768) {
    // tablet
    return 3;
  } else {
    // phone
    return 2;
  }
};
