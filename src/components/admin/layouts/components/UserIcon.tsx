// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { HiUserGroup } from 'react-icons/hi'
import { IconBaseProps, IconType } from 'react-icons'

interface UserIconProps {
  iconProps?: IconBaseProps
  icon: IconType;
  size?: number | string;
}

const UserIcon = (props: UserIconProps) => {
  // ** Props
  let { icon, size = '24px', iconProps = {} } = props;

  const IconTag = icon || HiUserGroup;
  
  iconProps = {
    ...iconProps,
    color: '#9d68fd',
    size: size
  }

  // @ts-ignore
  return <IconTag {...iconProps} />
}

export default UserIcon
