import { Box } from "@mui/material";
import Lottie from "react-lottie";
import LoadingLottie from "../../assets/Loading.json";

export const LoadingScreen = () => {
  return (
    <Box
      sx={{
        //backgroundColor: theme.palette.primary.main,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: LoadingLottie,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={window.innerHeight * 0.5}
        width={window.innerHeight * 0.5}
      />
    </Box>
  );
};
