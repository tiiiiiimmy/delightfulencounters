import yup from "yup";
import { getDatabase } from "./database.js";

//Define the limit schema for comments
const createCommentSchema = yup.object({
 
    content: yup.string().min(1).required(),
    comment_user_id: yup.number().required(),
    comment_article_id: yup.number().required(),
    parent_comment_id: yup.number().nullable()

}).required();

/**
 * Add a new comment and return. If the data is incomplete, an error will be thrown.
 *
 * @param {string} articleId 
 * @param {Object} commentData 
 * @returns {Promise<Object>} 
 * @throws If the input does not contain necessary data, throw an error
 */

 //Define an asynchronous function addComment for adding new comments
export async function addComment(comment_article_id, commentData) {

    //Verify and process new comment data
    const newComment = createCommentSchema.validateSync({ ...commentData, comment_article_id }, {

        //abortEarly: false: Do not abort verification immediately and collect all errors.
        abortEarly: false,
        
       //stripUnknown: true: Removes all undefined properties in the schema.
        stripUnknown: true
       
    });

    const db = await getDatabase();
    const comment_date = new Date();
    newComment.comment_date = comment_date;
    
    //Sum the current date. The time is set to the comment_date property of newComment.
    const result = await db.run(
        
        //Execute SQL insert statement to insert new comment data into the Comment table.
        "INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES(?,?,?,?,?)",
        newComment.content, newComment.comment_date, newComment.comment_user_id, newComment.comment_article_id, newComment.parent_comment_id

    );

    newComment.comment_id = result.lastID;
    return newComment;

}

/**
 * Get all comments for a specific article
 *
 * @param {string} comment_article_id 
 * @returns {Promise<Array<Object>>}
 */
export async function getCommentsByArticleId(articleId) {
    const db = await getDatabase();
    const query = `
        SELECT 
            c.comment_id, 
            c.content, 
            c.comment_date, 
            c.comment_user_id, 
            u.username AS comment_username, 
            c.comment_article_id, 
            c.parent_comment_id 
        FROM Comment c
        JOIN User u ON c.comment_user_id = u.user_id
        WHERE c.comment_article_id = ?
    `;
    const comments = await db.all(query, [articleId]);
    return comments;
}
/**
 * Delete comment with specified ID
 *
 * @param {string} comment_article_id 
 * @param {string} commentId 
 * @returns {Promise<boolean>} 
 */

//Define an asynchronous function deleteComment to delete a comment with a specified ID.
export async function deleteComment(comment_article_id, commentId) {
    const db = await getDatabase();

    console.log(`Attempting to delete comment with ID ${commentId} from article ${comment_article_id}`);
    const result = await db.run(
        "DELETE FROM Comment WHERE comment_id = ? AND comment_article_id = ?",
        commentId, comment_article_id
    );

    console.log(`Deleted ${result.changes} comment(s)`);
    return result.changes > 0;
}

export async function gitCommentUserId(commentId) {
    const db = await getDatabase();

    const comment = await db.get(
        "SELECT comment_user_id FROM Comment WHERE comment_id = ?", commentId
    );

    return comment.comment_user_id;
}