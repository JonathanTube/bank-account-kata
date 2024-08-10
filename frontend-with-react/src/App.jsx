import React, { useEffect, useState } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Chip } from "@nextui-org/react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { get } from './utils/http.util.js'
import { Spinner } from "@nextui-org/react"
import DepositModel from '../components/deposit.component.jsx'
import WithdrawModel from "../components/withdraw.component.jsx"
import TransferModel from "../components/transfer.component.jsx"

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [openDepositModel, setOpenDepositModel] = useState(false)
  const [openWithdrawModel, setOpenWithdrawModel] = useState(false)
  const [openTransferModel, setOpenTransferModel] = useState(false)
  const [items, setItems] = useState([])
  const [balance, setBalance] = useState(0)
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "createdAt",
    direction: "ascending",
  });

  const loadTableData = () => {
    get('/statement', {
      page,
      limit: 10,
      column: sortDescriptor.column,
      order: sortDescriptor.direction
    }).then(res => {
      const { success, message } = res
      if (success) {
        const { total, records, limit } = res.data
        setPages(Math.ceil(total / limit))
        setItems(records)
      } else {
        toast.warning(message)
      }
    }).catch(err => {
      toast(err.message)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const loadBalance = () => {
    get('/balance', {}).then(res => {
      const { success, message, data } = res
      if (success) {
        setBalance(data.balance)
      } else {
        toast.warning(message)
      }
    }).catch(err => {
      toast(err.message)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadBalance()
  }, [])

  useEffect(() => {
    loadTableData()
  }, [page, pages, sortDescriptor])


  const onHideDepositModel = () => {
    setOpenDepositModel(false)
    loadTableData()
    loadBalance()
  }

  const onHideWithdrawModel = () => {
    setOpenWithdrawModel(false)
    loadTableData()
    loadBalance()
  }

  const onHideTransferModel = () => {
    setOpenTransferModel(false)
    loadTableData()
    loadBalance()
  }


  const renderCell = React.useCallback((row, columnKey) => {

    const cellValue = row[columnKey]
    const category = row['category']

    if (columnKey === 'amount') {
      if (category === "deposit") {
        return <Chip color="primary">{'+' + cellValue}</Chip>
      } else if (category === "withdraw") {
        return <Chip color="secondary">{'-' + cellValue}</Chip>
      } else if (category === "transfer") {
        return <Chip color="danger">{'-' + cellValue}</Chip>
      }

    }

    return cellValue

  }, [])


  return (
    <main className="flex flex-col items-center w-screen h-screen npy-5">
      <p className="sticky w-full text-center leading-10 text-white text-xl h-10 bg-gradient-to-r from-cyan-600 to-blue-700">Your remaining balance is ${balance}</p>
      <div className="w-4/5">
        <nav className="flex justify-start gap-4 my-5">
          <Button color="primary" onClick={() => setOpenDepositModel(true)}>Deposit</Button>
          <Button color="secondary" onClick={() => setOpenWithdrawModel(true)}>Withdraw</Button>
          <Button color="danger" onClick={() => setOpenTransferModel(true)} >Transfer</Button>
        </nav>

        <DepositModel show={openDepositModel} onHide={onHideDepositModel} />
        <WithdrawModel show={openWithdrawModel} onHide={onHideWithdrawModel} />
        <TransferModel show={openTransferModel} onHide={onHideTransferModel} />

        <Table isStriped aria-label="data list of your bank account"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                showControls
                showShadow
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn key="id">ID</TableColumn>
            <TableColumn key="createdAt" allowsSorting>DATE</TableColumn>
            <TableColumn key="amount">AMOUNT</TableColumn>
            <TableColumn key="balance">BALANCE</TableColumn>
            <TableColumn key="category">CATEGORY</TableColumn>
          </TableHeader>

          <TableBody
            items={items}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={"No rows to display."}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
    </main >
  );
}