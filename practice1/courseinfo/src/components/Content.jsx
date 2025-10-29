import Part from "./Part"

const Content = ({ parts }) => {
    const totalExercises = parts.reduce(
        (sum, part) => sum + part.exercises, 0)
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
            <p>total of {totalExercises} exercise{totalExercises > 1 ? 's' : ''}</p>
        </div>
    )
}

export default Content