import { Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemName = "this item" }) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <ModalHeader className="bg-gray-800 rounded-t-lg"/>
      <ModalBody className="bg-gray-800 rounded-b-lg">
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-200 dark:text-gray-400">
            Are you sure you want to delete <strong>{itemName}</strong>?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color={"red"} onClick={onClose}>
              No, cancel
            </Button>
             <Button color={"green"} onClick={onConfirm}>
              {"Yes, I'm sure"}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmDeleteModal;
