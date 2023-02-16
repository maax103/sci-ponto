import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export function Topbar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box flex={1}>

          </Box>
          <Typography variant="h6" component="div">
            SCI - Helper | Ponto
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}