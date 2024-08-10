import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { post } from "../src/utils/http.util";
import { toast } from 'react-toastify';

export default function TransferModel(props) {
    const { show, onHide } = props

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [iban, setIban] = useState()

    const [amount, setAmount] = useState()

    useEffect(() => {
        if (show) {
            onOpen()
        } else {
            onClose()
            setIban(undefined)
            setAmount(undefined)
        }
    }, [show])

    const onCloseHandler = () => {
        onHide()
    }

    const onAmountChangeHandler = (e) => {
        setAmount(e.target.value)
    }
    const onIbanChangeHandler = (e) => {
        setIban(e.target.value)
    }

    const onConfirmHandler = () => {
        const transferAmount = +amount
        if (transferAmount && typeof transferAmount === 'number') {
            post('/transfer', {
                iban,
                amount: transferAmount
            }).then(res => {
                if (res.success) {
                    onHide()
                    toast.success('transfer successfully')
                } else {
                    toast.warning(res.message)
                }
            })
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onCloseHandler}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Transfer</ModalHeader>
                            <ModalBody>
                                <Input value={iban} label="Please enter the IBAN account" onChange={onIbanChangeHandler} />
                                <Input type="number" value={amount} label="Please enter the transfer amount" onChange={onAmountChangeHandler} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onConfirmHandler}>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}