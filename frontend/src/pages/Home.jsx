import {
  MenuBook,
  People,
  School,
  HowToReg,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";

const highlights = [
  {
    title: "Students",
    description:
      "Support student records and academic progress across the university.",
    icon: <School fontSize="large" />,
  },
  {
    title: "Lecturers",
    description:
      "Connect teaching staff with the courses they deliver.",
    icon: <People fontSize="large" />,
  },
  {
    title: "Courses",
    description:
      "Browse the academic catalogue offered by KoalaTech University.",
    icon: <MenuBook fontSize="large" />,
  },
  {
    title: "Enrollments",
    description:
      "Track how students are enrolled in university courses.",
    icon: <HowToReg fontSize="large" />,
  },
];

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" fontWeight={600}>
            KoalaTech University
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
          >
            Welcome to KoalaTech University
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            A simple homepage for the university portal.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          University Highlights
        </Typography>

        <Grid container spacing={3}>
          {highlights.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "white",
        }}
      >
        <Typography color="text.secondary">
          KoalaTech University
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
