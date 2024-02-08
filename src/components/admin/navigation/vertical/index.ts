
import { VerticalNavItemsType } from '../../@core/layouts/types';

import { FaNeos, FaHome, FaUsers } from 'react-icons/fa'
import { RiAuctionFill } from 'react-icons/ri'
import { MdLocalOffer, MdAdminPanelSettings } from 'react-icons/md'
import { BiDiamond } from 'react-icons/bi';

const navigation: any = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: FaHome,
      path: '/admin/dashboard',
    },

    {
      sectionTitle: 'Templates'
    },

    {
      title: 'Landing Page',
      icon: BiDiamond,
      path: '/admin/templates/landing-page'
    },
    {
      title: 'About Us',
      icon: BiDiamond,
      path: '/admin/templates/about-us'
    },
    {
      title: 'Header',
      icon: BiDiamond,
      path: '/admin/templates/header'
    },
    {
      title: 'Footer',
      icon: BiDiamond,
      path: '/admin/templates/footer'
    },

    {
      sectionTitle: 'USERS'
    },

    {
      title: ' All Users',
      icon: FaUsers,
      path: '/admin/users'
    },
    {
      title: 'Artists',
      icon: FaUsers,
      path: '/admin/artists'
    },


    {
      sectionTitle: 'AUTO REFUND/TRANSFER'
    },
    {
      title: 'Auction Nfts',
      icon: RiAuctionFill,
      path: '/admin/auctions'
    },
    {
      title: 'Offer Nfts',
      icon: MdLocalOffer,
      path: '/admin/offers'
    },
    {
      sectionTitle: 'OTHERS'
    },
    {
      title: 'All Nfts',
      icon: FaNeos,
      path: '/admin/allnfts',
      size: "20px"
    },
    {
      title: 'All Admin',
      icon: MdAdminPanelSettings,
      path: '/admin'
    }
  ]
}

export default navigation
