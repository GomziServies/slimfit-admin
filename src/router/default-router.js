import React from 'react'
import Index from '../views/dashboard/index'
// import { Switch, Route } from 'react-router-dom'

//Invoice
import CreateInvoice from '../views/dashboard/invoice/create-invoice'
import UpdateInvoice from '../views/dashboard/invoice/update-invoice'

// Sales
import SalesList from '../views/dashboard/invoice/sales-list'

//Booking
import Default from '../layouts/dashboard/default'
import Protect from '../views/dashboard/components/Protect'

export const DefaultRouter = [
  {
    path: '/',
    element: (
      <Protect>
        <Default />
      </Protect>),
    children: [
      // {
      //   path: 'dashboard',
      //   element: <Index />,
      // },
      {
        path: 'dashboard/create-invoice',
        element: <CreateInvoice />,
      },
      {
        path: 'dashboard/update-invoice',
        element: <UpdateInvoice />,
      },
      {
        path: 'dashboard/sales-list',
        element: <SalesList />,
      }
      // avadh
    ],
  },
]
