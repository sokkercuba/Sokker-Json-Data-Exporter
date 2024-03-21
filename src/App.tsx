import { ReactNode, SyntheticEvent, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Downloader, DownloadForm, Footer } from "./components";
import {
  CURRENT_WEEK_TRAINING,
  getTeamPlayersURL,
  JUNIORS_REPORT,
  TRAINING_SUMMARY,
  USER_DATA,
} from "./services/apiURLs";

interface TabPanelProps {
  index: number;
  value: number;
  children?: ReactNode;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "flex-start",
  color: theme.palette.text.secondary,
}));

const StackContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ width: "100%", p: "8px" }}>
      <Stack spacing={2}>{children}</Stack>
    </Box>
  );
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const App = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "450px",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="mui basic tabs">
          <Tab label="User" {...a11yProps(0)} />
          <Tab label="Players" {...a11yProps(1)} />
          <Tab label="Juniors" {...a11yProps(2)} />
          <Tab label="Training" {...a11yProps(3)} />
          <Tab label="All(plus)" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <StackContainer>
          <Item>
            <Downloader buttonText="Download data" query={USER_DATA} />
          </Item>
        </StackContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StackContainer>
          <Item>
            <DownloadForm buttonLabel="team" downloadCb={getTeamPlayersURL} />
          </Item>
        </StackContainer>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <StackContainer>
          <Item>
            <Downloader query={JUNIORS_REPORT} buttonText="Download data" />
          </Item>
        </StackContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <StackContainer>
          <Item>
            <Downloader
              buttonText="Download current week"
              query={CURRENT_WEEK_TRAINING}
            />
          </Item>
          <Item>
            <Downloader
              buttonText="Download summary"
              query={TRAINING_SUMMARY}
            />
          </Item>
        </StackContainer>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <StackContainer>
          <Item>
            <Downloader query="All" buttonText="Download all" />
          </Item>
        </StackContainer>
      </TabPanel>
      <Footer />
    </Box>
  );
};

export default App;
