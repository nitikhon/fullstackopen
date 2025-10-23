const Header = ({ course }) => {
  return (
    <>
      <h1>{course}</h1>
    </>
  )
}

const Part = ({ part, exercises }) => {
  return (
    <p>{part} {exercises}</p>
  )
}

const Content = ({ items }) => {
  let parts = []
  parts = items.map((item, index) => (
    <Part key={index} part={item.part} exercises={item.exercises} />
  ))
  return (
    <>
      {parts}
    </>
  )
}

const Total = ({ total }) => {
  let sum = 0;
  total.forEach(number => {
    sum += number;
  });

  return (
      <p>{sum}</p>
    )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content items={[
        {part: course.parts[0].name, exercises: course.parts[0].exercises},
        {part: course.parts[1].name, exercises: course.parts[1].exercises},
        {part: course.parts[2].name, exercises: course.parts[2].exercises},
      ]}/>
      <Total total={[course.parts[0].exercises, course.parts[1].exercises, course.parts[2].exercises]}/>
    </div>
  )
}

export default App