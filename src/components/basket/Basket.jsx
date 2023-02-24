import { useCallback } from "react"
import { Box, Modal } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteBasketItem,
  submitOrder,
  updateBasketItem,
} from "../../store/basket/basketSlice"
import { uiActions } from "../../store/ui/uiSlice"
import BasketItem from "./BasketItem"
import TotalAmount from "./TotalAmount"
import styled from "styled-components"

const Basket = ({ onClose, open }) => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.basket.items)

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, { amount, price }) => sum + amount * price, 0)
  }, [items])

  const decrementAmount = (id, amount) => {
    if (amount > 1) {
      dispatch(updateBasketItem({ amount: amount - 1, id: id }))
    } else {
      dispatch(deleteBasketItem(id))
    }
  }

  const incrementAmount = (id, amount) => {
    dispatch(updateBasketItem({ amount: amount + 1, id: id }))
  }

  const orderSubmitHandler = async () => {
    try {
      await dispatch(
        submitOrder({
          orderData: { items },
        })
      ).unwrap()
      dispatch(
        uiActions.showSnackBar({
          isOpen: true,
          severity: "success",
          message: "Order completed successfully!",
        })
      )
    } catch (error) {
      dispatch(
        uiActions.showSnackBar({
          isOpen: true,
          severity: "error",
          message: "Failed, Try again later!",
        })
      )
    } finally {
      onClose()
    }
  }

  return (
    <>
      <Modal onClose={onClose} open={open}>
        <ModalStyle>
          <Content>
            {items.length ? (
              <FixedHeightContainer>
                {items.map((item) => (
                  <BasketItem
                    key={item._id}
                    incrementAmount={() =>
                      incrementAmount(item._id, item.amount)
                    }
                    decrementAmount={() =>
                      decrementAmount(item._id, item.amount)
                    }
                    title={item.title}
                    price={item.price}
                    amount={item.amount}
                  />
                ))}
              </FixedHeightContainer>
            ) : null}
            <TotalAmount
              price={getTotalPrice()}
              onCLose={onClose}
              onOrder={orderSubmitHandler}
            />
          </Content>
        </ModalStyle>
      </Modal>
    </>
  )
}

export default Basket
const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 1rem 1.5rem 1rem;
`
const FixedHeightContainer = styled.div`
  max-height: 228px;
  overflow-y: scroll;
`
const ModalStyle = styled(Box)`
  position: fixed;
  top: 20vh;
  left: 5%;
  width: 90%;
  background-color: white;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 30;
  animation: 300ms ease-out forwards;
  width: 40rem;
  left: calc(50% - 20rem);

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
