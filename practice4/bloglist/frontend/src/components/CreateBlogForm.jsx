const CreateBlogFrom = (props) => {
    const { title, author, url } = props.blogInfo
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={props.handleCreateBlog}>
                <div>
                    <label htmlFor="title">title</label>
                    <input id="title" name="title" value={title} type="text" onChange={props.handleChange} />
                </div>
                <div>
                    <label htmlFor="author">author</label>
                    <input id="author" name="author" value={author} type="text" onChange={props.handleChange} />
                </div>
                <div>
                    <label htmlFor="url">url</label>
                    <input id="url" name="url" value={url} type="text" onChange={props.handleChange} />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default CreateBlogFrom