import { DateRangePicker, Select, SelectItem } from "@nextui-org/react"
import { useState } from "react"

export default function Search(prop) {
    const { onChange } = prop
    const [category, setCategory] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    const categoryHandler = (event) => {
        const value = event.target.value
        setCategory(value)
        onChange({
            startDate,
            endDate,
            category: value
        })
    }

    const dateRangeHandler = (dates) => {
        const { start, end } = dates
        if (start && end) {
            const strOfStartDate = start.toString()
            const strOfEndDate = end.toString()
            setStartDate(strOfStartDate)
            setEndDate(strOfEndDate)
            onChange({
                category,
                startDate: strOfStartDate,
                endDate: strOfEndDate
            })
        }
    }

    return (
        <div className="flex w-full h-12 gap-5">
            <Select label="Select a category" size="sm" onChange={categoryHandler}>
                <SelectItem key="">All</SelectItem>
                <SelectItem key="deposit">Deposit</SelectItem>
                <SelectItem key="withdraw">Withdraw</SelectItem>
                <SelectItem key="transfer">Transfer</SelectItem>
            </Select>
            <DateRangePicker
                label="Select a date range"
                size="sm"
                onChange={dateRangeHandler}
            />
        </div>
    )
}