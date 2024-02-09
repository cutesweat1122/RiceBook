const Article = require('./model/Article')

const mapArticle = (article) => {
  console.log({ article })
  return {
    id: article._id,
    author: article.author,
    text: article.text,
    image: article.image,
    date: article.created,
    comments: article.comments,
  }
}

async function getArticleById(req, res) {
  try {
    const articleId = req.params.id
    if (!articleId) {
      return res.sendStatus(400)
    }
    const article = await Article.findOne({ _id: articleId })
    if (!article) {
      return res.status(404).send({ articleId: articleId, result: 'not found' })
    }
    return res.send({ articles: [mapArticle(article)] })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function getArticles(req, res) {
  try {
    const articleId = req.params.id
    const { offset, limit } = req.query
    if (articleId) {
      return getArticleById(req, res)
    }
    const { username, following } = req.user
    // get articles from following users
    let articles = []
    if (!offset || !limit) {
      articles = await Article.find({
        author: { $in: [...following, username] },
      })
        .sort([['created', -1]])
        .exec()
    } else {
      articles = await Article.find({
        author: { $in: [...following, username] },
      })
        .sort([['created', -1]])
        .skip(offset)
        .limit(limit)
        .exec()
    }
    const articlesCount = await Article.countDocuments({
      author: { $in: [...following, username] },
    }).exec()

    res.send({
      articles: articles.map(mapArticle),
      articlesCount,
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function postArticle(req, res) {
  try {
    const username = req.user.username
    const { text, image } = req.body

    if (!text) {
      return res.sendStatus(400)
    }
    const article = new Article({
      text,
      image,
      author: username,
    })
    await article.save()

    getArticles(req, res)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const putArticle = async (req, res) => {
  try {
    const articleId = req.params.id
    const { text, commentId } = req.body
    if (!articleId || !text) {
      return res.sendStatus(400)
    }
    const article = await Article.findOne({ _id: articleId }).exec()
    if (!article) {
      return res.status(404).send({ articleId: articleId, result: 'not found' })
    }
    if (commentId) {
      if (commentId === -1) {
        article.comments.push({
          id: article.comments.length + 1,
          text: text,
          author: req.user.username,
        })
      } else {
        const comment = article.comments.find((c) => c.id === commentId)
        if (!comment) {
          return res
            .status(404)
            .send({ commentId: commentId, result: 'comment not found' })
        }
        comment.text = text
      }
    } else {
      article.text = text
    }
    await article.save()
    return res.send({ articles: [mapArticle(article)] })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = (app) => {
  app.get('/api/articles/:id?', getArticles)
  app.put('/api/articles/:id', putArticle)
  app.post('/api/article', postArticle)
}
