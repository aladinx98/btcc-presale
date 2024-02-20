import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { FaTimes } from 'react-icons/fa'
import { list } from '../../Helpers/tokenlist'
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#202020",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  color: "#fff",
  borderRadius: 2,
};

export default function ChainChangeModal({
  open,
  setOpen,
  handleOpen,
  handleClose,
  currentChain,
  setCurrentChain,
  setData,
}) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg font-bold">Select Currency</h2>
            <button onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <div className="grid gap-4">
            {list.map((value, index) => (
              <button
                key={index}
                className={`
                  bg-gray-800
                 grid  grid-flow-col justify-start gap-3 items-center  p-2 rounded-lg`}
                onClick={() => {
                  setCurrentChain(value);
                  handleClose();
                  setData({ bnb: "", gart: "" });
                }}
              >
                <img src={value.icon} alt={value.name} className="w-6" />
                <p>{value.name}</p>
              </button>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
