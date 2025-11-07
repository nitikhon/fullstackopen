const PersonForm = ({ onSubmit, onChange }) => (
    <form onSubmit={onSubmit}>
        <div>
            name: <input id="name" onChange={onChange} />
            number: <input id="phone" onChange={onChange} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

export default PersonForm