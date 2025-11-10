var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return (
        blogs.length === 0
            ? 0
            : blogs.reduce(reducer, 0)
    )
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const top = _.maxBy(blogs, 'likes')
    return {author: top.author, likes: top.likes}
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const countByAuthor = _.countBy(blogs, 'author')
    const authors = _.map(countByAuthor, (blogsCount, author) => {
        return { author, blogs: blogsCount }
    })
    const top = _.maxBy(authors, 'blogs')
    return top
}

module.exports = {
    dummy,
    totalLikes,
    mostLikes,
    mostBlogs
}