import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { post } from "../src/utils/http.util";
import { toast } from 'react-toastify';

export default function WithdrawModel(props) {
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
        const withdrawAmount = +amount
        if (withdrawAmount && typeof withdrawAmount === 'number') {
            post('/withdraw', {
                amount: withdrawAmount
            }).then(res => {
                if (res.success) {
                    onHide()
                    toast.success('Withdraw successful!')
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
                            <ModalHeader>Withdraw</ModalHeader>
                            <ModalBody>
                                <Input type="number" value={amount} label="Please enter the withdraw amount" onChange={onChangeHandler} />
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