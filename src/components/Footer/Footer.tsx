import { Box } from '@mui/material/'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import PolicyIcon from '@mui/icons-material/Policy'
import ContactMailIcon from '@mui/icons-material/ContactMail'

function Copyright() {
  return (
    <Typography variant="caption" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/sokkercuba">
        Sokker Cuba
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <Tooltip arrow placement="right" title="sokkercuba@gmail.com">
        <IconButton>
          <ContactMailIcon
            fontSize="small"
            color="disabled"
            aria-label="Contact mail icon"
          />
        </IconButton>
      </Tooltip>
    </Typography>
  )
}

export function Footer() {
  return (
    <Box
      sx={{
        mt: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        component="footer"
        sx={{
          px: 1,
          mt: 'auto'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            p: '0 24px 24px',
            flexDirection: 'column'
          }}
        >
          <Typography variant="caption">Made by fans for fans!</Typography>
          <Divider sx={{ my: '8px' }} />

          <Typography variant="caption">
            This extension helps sokker.org authenticated users to get JSON data
            from its api so it can be used in local tools to improve the
            management of your team.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Copyright />
            <Tooltip
              arrow
              placement="left"
              title="https://www.sokkercuba.com/addon/privacy"
            >
              <Link
                key="privacy"
                variant="body2"
                underline="hover"
                color="text.secondary"
                href="https://www.sokkercuba.com/addon/privacy"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <PolicyIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Privacy Policy
              </Link>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
