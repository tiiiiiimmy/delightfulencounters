import express from "express";

//for image
import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";

const router = express.Router();

import { retrieveArticles, searchAndSortArticles, updateArticle, addNewArticle, deleteArticle, unlikeArticle, likeArticle, getLikeCountByArticleId, retrieveArticlesContent, checkIfUserLikedArticle, retrieveMyArticles } from "../../data/articles-dao.js";
import { addComment, deleteComment, getCommentsByArticleId, gitCommentUserId } from "../../data/comments-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
// get all articles
router.get("/", async (req, res) => {
    const articles = await retrieveArticles();
    if (!articles) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    return res.json(articles);
});

router.get("/get-my-articles", requiresAuthentication, async (req, res) => {
    const userId = req.user.user_id;
    const articles = await retrieveMyArticles(userId);
    if (!articles) {
        return res.status(404).json({ message: 'Article not found' });
    }
    return res.json(articles);
});


router.get('/get-content/:articleId', async (req, res) => {
    const { articleId } = req.params;
    const article = await retrieveArticlesContent(articleId);
    if (!article) {
        return res.status(404).json({ message: 'Article not found' });

    }
    return res.status(200).json(article);
});

// search and sort articles
router.get('/search', async (req, res) => {
    const { search, sort } = req.query;

    let searchParams = {};
    if (search) {
        const [field, term] = search.split(':');
        searchParams = { field, term };
    }

    const sortedAndFilteredArticles = await searchAndSortArticles(searchParams, sort);

    return res.status(200).json(sortedAndFilteredArticles);
});

// Get an instance of multer. Files will be uploaded to the "temp" folder.
const upload = multer({ dest: 'temp' });

// add new article
router.post("/", upload.single("image-file"), requiresAuthentication, async (req, res) => {
    // console.log(req.file.originalname);
    // console.log(req.file.path);
    // create a custom file name for our newly uploaded file, and move it into the
    // public/images folder. We're creating a random file name here;
    let newFileName = null;

    if (req.file) {
        const originalname = req.file.originalname;
        const fileExtension = originalname.substring(originalname.lastIndexOf("."));
        newFileName = uuid() + fileExtension;
        // console.log(newFileName);
        // Move the file using fs package. We can do this using rename operations
        fs.renameSync(req.file.path, `public/images/${newFileName}`);
    }
    // Now let's send req.body.message and the path of the image back to the browser, as JSON.
    const articleData = {
        author_id: req.user.user_id,//get userid by cookies
        title: req.body.title,
        content: req.body.content,
        image: newFileName ? `${newFileName}` : null// Remember not to include "public" since that part will be ignored in the URL.
    };

    const article = await addNewArticle(articleData);
    if (!article) {
        return res.status(409).json({ message: 'Article already exists' });
    }
    return res.status(201).json(article);
});

//edit article
router.put('/:articleId', upload.single("image-file"), requiresAuthentication, async (req, res) => {
    const { articleId } = req.params;
    let newFileName = null;
    let updateArticleData;
    if (req.file) {
        const originalname = req.file.originalname;
        const fileExtension = originalname.substring(originalname.lastIndexOf("."));
        newFileName = uuid() + fileExtension;
        fs.renameSync(req.file.path, `public/images/${newFileName}`);
        updateArticleData = {
            title: req.body.title,
            content: req.body.content,
            image: newFileName ? `${newFileName}` : null
        };
    } else {
        updateArticleData = {
            title: req.body.title,
            content: req.body.content,
            image: req.body.currentImage
        }
    }
    const existingArticle = await updateArticle(articleId, updateArticleData);

    if (!existingArticle) {
        return res.status(404).json({ message: 'Article not found' });
    }
    return res.status(200).json(existingArticle);
});

//delete article
router.delete('/:articleId', async (req, res) => {
    const { articleId } = req.params;
    const article = await deleteArticle(parseInt(articleId, 10));
    //deleteArticle needs to be implemented

    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({ message: 'Article deleted successfully' });

});

//like article
router.put('/:articleId/like', async (req, res) => {
    const { articleId } = req.params;
    const { userId } = req.body;

    const article = await likeArticle(articleId, userId);
    if (!article) {
        return res.status(404).json({ message: 'Article or user not found' });
    }
    return res.status(200).json(article);

});

//unlike article
router.delete('/:articleId/like', async (req, res) => {
    const { articleId } = req.params;
    const { userId } = req.body;
    const result = await unlikeArticle(articleId, Number(userId));

    if (!result.success) {
        return res.status(404).json({ message: result.message });
    }
    return res.status(200).json({ message: result.message });
});

//like count of article
router.get('/:articleId/like', async (req, res) => {
    const { articleId } = req.params;
    const likesCount = await getLikeCountByArticleId(articleId);
    if (!likesCount) {
        return res.status(404).json({ message: 'Likes not found' });
    }
    return res.status(200).json(likesCount);
});

router.get('/:articleId/check-like/:userId', async (req, res) => {
    const { articleId, userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const liked = await checkIfUserLikedArticle(articleId, userId);
    res.json({ liked });

});

//add comment to article
router.post('/:articleId/comments', requiresAuthentication, async (req, res) => {
    const { articleId } = req.params;

    const commentData = {
        content: req.body.content,
        comment_user_id: req.user.user_id,
        parent_comment_id: req.body.parent_comment_id
    }

    try {
        const comment = await addComment(articleId, commentData);
        return res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

//delete comment 
router.delete('/:articleId/comments/:commentId', requiresAuthentication, async (req, res) => {
    const { articleId, commentId } = req.params;
    const userId = req.user.user_id;
    const commentUserId = await gitCommentUserId(commentId);
    if (userId !== commentUserId) {
        return res.status(401).json({ message: 'It is not your comment, no authorization for deletion.' });
    }
    const comment = await deleteComment(articleId, commentId);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json({ message: 'Comment deleted successfully' });

});

//get comments of a article
router.get('/:articleId/comments', async (req, res) => {
    const { articleId } = req.params;

    const comments = await getCommentsByArticleId(articleId);
    //getComments needs to be implemented
    if (!comments) {
        return res.status(404).json({ message: 'Comments not found' });
    }
    return res.status(200).json(comments);
});

export default router;
