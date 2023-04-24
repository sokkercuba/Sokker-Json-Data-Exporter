import Box from '@mui/material/Box'
import { Downloader } from '../Downloader'
import { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import { validateInputValue } from '../../utils/validateInputValue'

interface DownloaderFormProps {
  inputLabel: string
  downloadCb: (value: string) => string
}

export const DownloadForm = ({
  inputLabel,
  downloadCb
}: DownloaderFormProps) => {
  const [value, setValue] = useState<string>('')
  const [error, setFormError] = useState(false)

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <TextField
        error={error}
        size="small"
        value={value}
        variant="standard"
        id="outlined-controlled"
        label={
          !error
            ? `Enter ${inputLabel} ID`
            : `Please add a correct ${inputLabel} ID.`
        }
        sx={{ minWidth: '248px', ml: '64px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {inputLabel === 'team' ? (
                <PeopleOutlineIcon
                  sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                />
              ) : (
                <PermIdentityIcon
                  sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                />
              )}
            </InputAdornment>
          )
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (error) setFormError(false)
          setValue(event.target.value)
        }}
      />
      <Downloader
        buttonText={`Download ${inputLabel} data`}
        onFormError={() => setFormError(true)}
        query={
          value.trim() && validateInputValue(value) ? downloadCb(value) : ''
        }
      />
    </Box>
  )
}
