
import { getDatabase } from "./database.js";
import yup from 'yup';


export async function retrieveArticles() {
    const db = await getDatabase();
    return await db.all(`   
    SELECT   Article.*, 
             User.username         
    FROM     Article         
    JOIN     User ON Article.author_id = User.user_id     
    `);
}

export async function retrieveArticlesContent(articleId) {
    const db = await getDatabase();
    return await db.get(`
    SELECT   Article.*,     
             User.username
    FROM     Article
    JOIN     User ON Article.author_id = User.user_id
    WHERE    Article.article_id = ?
`, articleId);
}

export async function retrieveMyArticles(userId) {
    const db = await getDatabase();
    return await db.all(`
    SELECT   Article.*,
                User.username   
    FROM     Article
    JOIN     User ON Article.author_id = User.user_id
    WHERE    Article.author_id = ?
`, userId);
}


export async function searchAndSortArticles(search, sort) {
    const db = await getDatabase();
    let query = `SELECT Article.*, User.username
    FROM Article, User
    WHERE Article.author_id = User.user_id`;

    let params = [];

    if (search) {
        const { field, term } = search;
        const lowercaseTerm = term.toLowerCase();

        if (field === 'date') {
            query += ` AND (DATE(Article.published_date) LIKE ?)`;
            params.push(`%${lowercaseTerm}%`);
        } else if (field === 'username') {
            query += ` AND (LOWER(User.username) LIKE ?)`;
            params.push(`%${lowercaseTerm}%`);
        } else if (field === 'title' || field === 'content') {
            query += ` AND (LOWER(Article.${field}) LIKE ?)`;
            params.push(`%${lowercaseTerm}%`);
        } else {
            query += ` AND (LOWER(Article.title) LIKE ? OR LOWER(Article.content) LIKE ? OR LOWER(User.username) LIKE ?)`;
            params.push(`%${lowercaseTerm}%`, `%${lowercaseTerm}%`, `%${lowercaseTerm}%`);
        }
    }

    if (sort) {
        switch (sort) {
            case 'date':
                query += ' ORDER BY Article.published_date ASC';
                break;
            case 'username':
                query += ' ORDER BY User.username ASC';
                break;
            case 'title':
                query += ' ORDER BY Article.title ASC';
                break;
            default:
                query += ' ORDER BY Article.title ASC';
        }
    }

    const articles = await db.all(query, ...params);
    return articles;
}



const articleSchema = yup.object({
    title: yup.string().required(),
    author_id: yup.number().integer().required(),
    image: yup.string().nullable(),
    //the verify of the image is not complete
    content: yup.string().required()
}).required();

export async function addNewArticle(articleData) {
    const db = await getDatabase();
    const newArticle = await articleSchema.validate(articleData, {
        abortEarly: false,
        stripUnknown: true
    });

    const existing = await db.get("SELECT * FROM Article WHERE title = ?", newArticle.title);
    if (existing) return null;
    newArticle.published_date = new Date();
    const result = await db.run(
        "INSERT INTO Article (title, published_date, author_id, image, content) VALUES (?, ?, ?, ?, ?)",
        newArticle.title, newArticle.published_date, newArticle.author_id, newArticle.image, newArticle.content
    );

    newArticle.article_id = result.lastID;
    return newArticle;
}



const updateArticleSchema = yup.object({
    title: yup.string().required(),
    image: yup.string().nullable(),
    content: yup.string().required()
}).required();

export async function updateArticle(articleId, updateData) {
    const db = await getDatabase();
    const validatedData = await updateArticleSchema.validate(updateData, {
        abortEarly: true,
        stripUnknown: true
    });

    const updateFields = [];
    const updateValues = [];
    Object.keys(validatedData).forEach(key => {
        updateFields.push(`${key} = ?`);
        updateValues.push(validatedData[key]);
    });

    if (updateValues.length === 0) return false;

    const sql = `UPDATE Article SET ${updateFields.join(", ")} WHERE article_id = ?`;
    updateValues.push(articleId);

    const result = await db.run(sql, ...updateValues);
    return result.changes > 0;
}



export async function deleteArticle(articleId) {
    const db = await getDatabase();

    const exists = await db.get("SELECT 1 FROM Article WHERE article_id = ?", articleId);
    if (!exists) {
        return null;
    }
    const result = await db.run("DELETE FROM Article WHERE article_id = ?", articleId);
    if (!result || result.changes === 0) {
        console.error("Delete failed, please try again later.");
        return null;
    }
    return "The article was successfully deleted.";
}



export async function unlikeArticle(articleId, userId) {
    const db = await getDatabase();

    const article = await db.get(`SELECT * FROM Article WHERE article_id = ?`, articleId);
    if (!article) {
        return { success: false, message: 'Article not found' };
    }

    const likeExists = await db.get(`SELECT * FROM Likes WHERE like_user_id = ? AND like_article_id = ?`, userId, articleId);
    if (!likeExists) {
        return { success: false, message: 'Like not found' };
    }

    const result = await db.run(`DELETE FROM Likes WHERE like_user_id = ? AND like_article_id = ?`, userId, articleId);
    if (!result || result.changes === 0) {
        return { success: false, message: 'Failed to remove like' };
    }

    return { success: true, message: 'Like removed successfully' };
}

export async function getArticlesCount(userId) {
    const db = await getDatabase();
    const count = await db.get(`SELECT COUNT(*) AS article_count FROM Article WHERE author_id = ?`, userId);
    return count.article_count;

}
export async function likeArticle(articleId, userId) {
    const db = await getDatabase();

    const article = await db.get(`SELECT * FROM Article WHERE article_id = ?`, articleId);
    const user = await db.get(`SELECT * FROM User WHERE user_id = ?`, userId);
    if (!article || !user) {
        return null;
    }

    const likeExists = await db.get(`SELECT * FROM Likes WHERE like_article_id = ? AND like_user_id = ?`, articleId, userId);
    if (!likeExists) {
        await db.run(`INSERT INTO Likes (like_article_id, like_user_id) VALUES (?, ?)`, articleId, userId);
    }

    const updatedArticle = await db.get(`SELECT * FROM Article WHERE article_id = ?`, articleId);
    if (!updatedArticle) {
        return null;
    }
    return updatedArticle;
}

export async function getLikeCountByArticleId(articleId) {
    const db = await getDatabase();
    if (!articleId) {
        return null;
    }
    return await db.get(`SELECT COUNT(*) AS like_count FROM Likes WHERE like_article_id = ?`, articleId);
}

export async function checkIfUserLikedArticle(articleId, userId) {
    const db = await getDatabase();

    const likeExists = await db.get(`
        SELECT *
        FROM Likes 
        WHERE like_article_id = ? AND like_user_id = ?`,
        articleId, userId
    );

    return likeExists ? true : false;
}