// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import { Metamask } from '../../../../../../context'
import Image from 'next/image'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }


  const { logout, walletDisconnect, user, isAuthenticated, login, isAdminLoggedIn }: any = Metamask.useContext();

  const connectToWallet = async () => {
    await login();
  }

  const signOut = async (event: any) => {
    event.preventDefault();
    await logout();
    router.push('/');
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={user.name}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
        // src={user.name}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          component="div" sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box
            component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt={user?.name} src={user?.name || ""} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box
              component="div" sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {user.role || ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />
        {isAdminLoggedIn ? (
          <>
            {isAuthenticated ? (
              <MenuItem sx={{ py: 2 }} onClick={walletDisconnect}>
                <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
                Disconnect Wallet
              </MenuItem>
            ) : (
              <MenuItem sx={{ py: 2 }} onClick={connectToWallet}>
                <Image
                  src="/wallet.gif"
                  alt="my image"
                  height={25}
                  width={25}
                  style={{ marginRight: 5 }}
                />
                Connect Wallet
              </MenuItem>
            )}
            <MenuItem sx={{ py: 2 }} onClick={signOut}>
              <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem sx={{ py: 2 }} onClick={connectToWallet}>
            <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
            login
          </MenuItem>
        )
        }
      </Menu>
    </Fragment >
  )
}

export default UserDropdown
