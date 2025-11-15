const LoginForm = ({ handleLogin, handleChange, username, password }) => (
    <div>
        <h1>login to an application</h1>
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password">password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                    />
            </div>
            <button type="submit">login</button>
        </form>
    </div>
)

export default LoginForm