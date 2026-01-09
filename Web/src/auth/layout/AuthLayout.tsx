import { Grid, Typography } from "@mui/material";
import { Children } from "../../interfaces";

interface Props extends Children {
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: Props) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", bgcolor: "primary.main", p: 4 }}
    >
      <Grid
        item
        className="box-shadow animate__animated animate__fadeIn"
        xs={3}
        sx={{
          width: { sm: 450 },
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ mb: 1 }}>{subtitle}</Typography>
        {children}
      </Grid>
    </Grid>
  );
};
