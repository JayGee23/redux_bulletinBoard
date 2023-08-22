import { useDispatch, useSelector } from "react-redux"
import { decrement, increment, reset, incrementByAmount } from "./counterSlice"
import { useState } from "react"

//Counter component
const Counter = () => {
    const count = useSelector((state) => state.counter.count)
    const dispatch = useDispatch()

    const [incrementAmount, setIncrementAmount] = useState(0)

    const addValue = Number(incrementAmount) || 0

    const increaseCount = () => {
        dispatch(increment())
    }

    const decreaseCount = () => {
        dispatch(decrement())
    }

    const resetCount = () => {
        setIncrementAmount(0)
        dispatch(reset())
    }

    const incrementValue = () => {
        dispatch(incrementByAmount(addValue))
    }

    return (
        <section>
            <p>{count}</p>
            <div>
                <button onClick={increaseCount}>+</button>
                <button onClick={decreaseCount}>-</button>
            </div>

            <div>
                <input type="text" value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)} />
                <button onClick={incrementValue}>Add Value</button>
            </div>
            <div>
                <button onClick={resetCount}>Reset</button>
            </div>
        </section>
    )
}

export default Counter