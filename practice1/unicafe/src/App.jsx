import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticsLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
            {text == "positive" ? <td>%</td> : <></>}
        </tr>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    if (good == 0 && neutral == 0 && bad == 0) return <p>"No feedback given"</p>
    let avg = (good + bad + neutral) / 3
    let positivePercent = good * 100 / (good + bad + neutral)
    return (
        <table>
            <tbody>
                <StatisticsLine text={"good"} value={good}/>
                <StatisticsLine text={"neutral"} value={neutral}/>
                <StatisticsLine text={"bad"} value={bad}/>
                <StatisticsLine text={"average"} value={avg.toFixed(1)}/>
                <StatisticsLine text={"positive"} value={positivePercent.toFixed(1)}/>
            </tbody>
        </table>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>Give a feedback!</h1>
            <Button onClick={() => setGood(g => g + 1)} text={"good"} />
            <Button onClick={() => setNeutral(n => n + 1)} text={"neutral"} />
            <Button onClick={() => setBad(b => b + 1)} text={"bad"} />
            <h1>Statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App