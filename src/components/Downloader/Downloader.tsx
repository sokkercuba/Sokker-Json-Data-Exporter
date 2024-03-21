/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from "axios";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { green } from "@mui/material/colors";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadingIcon from "@mui/icons-material/Downloading";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getAll, apiClient, parseApiErrors } from "../../services";
import { copyTextToClipboard } from "../../utils/copyTextToClipboard";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

interface DownloaderProps {
  direct?: boolean;
  query: string;
  buttonText: string;
  onFormError?: () => void;
}

interface CopyMessages {
  none: string;
  error: string;
  success: string;
  copying: string;
}

const copyMessages: CopyMessages = {
  none: "",
  copying: "",
  error: "Copy failed",
  success: "Data copied",
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Downloader({
  query,
  buttonText,
  onFormError,
}: DownloaderProps) {
  const timer = useRef<number>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [data, setData] = useState<AxiosResponse>();
  const [responseText, setResponseText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("error");
  const [copyStatus, setCopyStatus] = useState<keyof CopyMessages>("none");

  const stringifiedData = useMemo(() => JSON.stringify(data), [data]);
  const copyToClipboardText = "Copy to clipboard";

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
    setIsCopied(false);
  };

  const handleTooltipOpen = () => {
    if (copyStatus !== "copying") {
      setTooltipOpen(true);
    }
  };

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const copyToClipboard = () => {
    handleTooltipClose();
    setCopyStatus("copying");

    copyTextToClipboard(stringifiedData)
      .then(() => {
        timer.current = window.setTimeout(() => {
          setIsCopied(true);
          setCopyStatus("success");
          handleTooltipOpen();
        }, 1500);
      })
      .catch((error) => {
        const { response, code } = error;
        const errorCode = response?.status ?? code;
        setIsCopied(true);
        setCopyStatus("error");
        handleTooltipOpen();
        handleAlertOpen();
        setAlertSeverity("error");
        setResponseText(parseApiErrors(errorCode?.toString() || ""));
      });
  };

  const getApiData = async () => {
    if (!query && onFormError) {
      onFormError();
      return;
    }

    setLoading(true);
    setSuccess(false);

    if (query === "All") {
      const result: any = await getAll();
      const { code, ...rest } = result;

      if (!rest || code !== 200) {
        setSuccess(false);
        handleAlertOpen();
        setAlertSeverity("error");
        setResponseText(parseApiErrors(result?.code || ""));
      } else {
        setData(rest as any);
        setSuccess(true);
      }

      setLoading(false);
      return;
    }

    if (query)
      await apiClient
        .get(query)
        .then((response) => {
          const { status, data } = response || null;

          if (status === 200 && data && !data?.error) {
            if (query.includes("report")) {
              setData({ ...data, id: Number(query.split("/")[2]) });
            } else {
              setData(data);
            }

            setSuccess(true);
          }
          if (data?.error) {
            setSuccess(false);
            handleAlertOpen();
            setAlertSeverity("error");
            setResponseText(parseApiErrors(response.status.toString()));
          }
        })
        .catch((error: AxiosError) => {
          const { response, code } = error;
          const errorCode = response?.status ?? code;
          setSuccess(false);
          handleAlertOpen();
          setAlertSeverity("error");
          setResponseText(parseApiErrors(errorCode?.toString() || ""));
        })
        .finally(() => {
          setLoading(false);
        });
  };

  const handleButtonClick = () => {
    if (!loading) {
      getApiData();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ m: 1, position: "relative" }}>
        <Fab
          size="small"
          sx={buttonSx}
          color="primary"
          aria-label={buttonText}
          onClick={handleButtonClick}
        >
          {success ? (
            <CheckIcon fontSize="small" />
          ) : (
            <DownloadingIcon fontSize="small" />
          )}
        </Fab>
        {loading && (
          <CircularProgress
            size={52}
            sx={{
              top: -6,
              left: -6,
              zIndex: 1,
              color: green[500],
              position: "absolute",
            }}
          />
        )}
      </Box>
      <Box sx={{ m: 1, position: "relative" }}>
        <Button
          size="small"
          disabled={loading}
          variant="contained"
          onClick={handleButtonClick}
          sx={{ ...buttonSx, minWidth: "248px" }}
        >
          {buttonText}
        </Button>

        <Tooltip
          arrow
          open={tooltipOpen}
          placement="top"
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          title={isCopied ? copyMessages[copyStatus] : copyToClipboardText}
        >
          <IconButton onClick={copyToClipboard}>
            <ContentCopyIcon
              fontSize="small"
              color="disabled"
              aria-label="Content Copy Icon"
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Snackbar open={alertOpen} onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {responseText}
        </Alert>
      </Snackbar>
    </Box>
  );
}
