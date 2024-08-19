import { Button, ButtonGroup, Typography } from "@mui/material";
import agent from "../../app/api/agent";

function AboutPage() {
  return (
    <>
      <Typography variant="h2">About Page</Typography>
      <ButtonGroup>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.getValidationError().catch((error) =>
              console.log(error)
            )
          }
        >
          Validation Error
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get400Error().catch((error) => console.log(error))
          }
        >
          400 Error
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get500Error().catch((error) => console.log(error))
          }
        >
          500 Error
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get404Error().catch((error) => console.log(error))
          }
        >
          404 Error
        </Button>
      </ButtonGroup>
    </>
  );
}

export default AboutPage;
