const Persons = ({ persons, handleDelete }) => (
    persons.map(person => {
        return (
            <div key={person.id}>
                {person.name} {person.number}  <button onClick={() => handleDelete(person.name, person.id)}>delete</button>
            </div>
        )
    })
)

export default Persons