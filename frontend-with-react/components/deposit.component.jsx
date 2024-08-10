import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { post } from "../src/utils/http.util";
import { toast } from 'react-toastify';

export default function DepositModel(props) {
    const { show, onHide } = props

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [amount, setAmount] = useState()

    useEffect(() => {
        if (show) {
            onOpen()
        } else {
            onClose()
            setAmount(undefined)
        }
    }, [show])

    const onCloseHandler = () => {
        onHide()
    }

    const onChangeHandler = (e) => {
        setAmount(e.target.value)
    }

    const onConfirmHandler = () => {
        const depositAmount = +amount
        if (depositAmount && typeof depositAmount === 'number') {
            post('/deposit', {
                amount: depositAmount
            }).then(res => {
                if (res.success) {
                    onHide()
                    toast.success('Deposit successful!')
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
                            <ModalHeader>Deposit</ModalHeader>
                            <ModalBody>
                                <Input type="number" value={amount} label="Please enter the deposit amount" onChange={onChangeHandler} />
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