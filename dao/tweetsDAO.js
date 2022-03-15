import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;  // Use ObjectID to convert a String to a MongoDB object.

let tweets;

export default class TweetsDAO {
    static async injectDB(conn) {
        if (tweets) {  // If the tweet already exists.
            return;
        }
        try {
            tweets = await conn.db(process.env.TWITTCLONE_NS).collection("tweets");  // If it doesn't exist already, it will be created when trying to add a document to it.
            console.error("tweetsDAO.js has established collection handles.")
        } catch (e) {
            console.error(`Unable to establish collection handles in tweetsDAO: ${e}`)
        }
    }

    static async getTweets({   // Gets a list of all tweets in the database.
        filters = null,     // Default by null, unless user passes something in.
        page = 0,   // Defaults to page 0.
        tweetsPerPage = 20,    // Defaults to 20 tweets per page.
    } = {}) {
        let query;   // If query isn't set to anything, it returns all tweets.
        if (filters) {  // User can search by name, cuisine, or zipcode.
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } } // Specified in MongoDB will check a certain field.         // What does $text mean?
            // } else if ("cuisine" in filters) {
                // query = { "cuisine": { $eq: filters["cuisine"] } }
            // } else if ("zipcode" in filters) {
                // query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }

            // filter userName
            // else filter hashtag


            // else {
                // query = { "_id_" : { $eq: "6228f2384d2de6ffdbc95989" }}
            // }


        }

        let cursor;

        try {
            cursor = await tweets
            
            
            // console.error(cursor)
            // console.error(query)


            
            .find(query)    // Find all tweets in the database that match this query.
            // .find()



        } catch (e) {   // If there is no query, returns an error.
            console.error(`Unable to issue find command, ${e}`);
            return { tweetsList: [], totalNumTweets: 0 }
        }

        const displayCursor = cursor.limit(tweetsPerPage).skip(tweetsPerPage * page); // To locate which page user is on, use the limit and current page to determine what to display.

        try {
            const tweetsList = await displayCursor.toArray();
            const totalNumTweets = await tweets.countDocuments(query);

            return { tweetsList, totalNumTweets }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { tweetsList: [], totalNumTweets: 0 }
        }
    }

    static async addTweet(user, tweet, date) {
        try {
            const tweetDoc = { 
                user_id: user._id,
                text: tweet,
                date: date,
                // tweet_id: ObjectId(tweetId),  // Converts tweet_id into an ObjectId.
            }

            return await tweets.insertOne(tweetDoc); // Inserts into the database.
        } catch (e) {
            console.error(`Unable to post tweet: ${e}`);
            return { error: e }
        }
    }

    static async updateTweet(tweetId, userId, text, date) {
        try {
            const updateResponse = await tweets.updateOne(
                { user_id: userId, _id: ObjectId(tweetId)},    // Looks for the userId and tweetId. We don't want to update unless they are the original writer.
                { $set: { text: text, date: date } },   // Then sets the new text of the tweet and the new date.
            )
            
            return updateResponse
        } catch (e) {
            console.error(`Unable to update tweet: ${e}`);
            return { error: e }
        }
    }

    static async deleteTweet(tweetId, userId) {
        try {
            const deleteResponse = await tweets.deleteOne({
                _id: ObjectId(tweetId),    // Looks for the userId and tweetId. We don't want to delete unless they are the original writer.
                user_id: userId,
            })

            // if (deleteResponse.deletedCount != 1) {
            //     throw "`Unable to delete tweet";
            // } else {
            //     return deleteResponse
            // }
            return deleteResponse;
            
            
        } catch (e) {
            console.error(`Unable to delete tweet: ${e}`);
            return { error: e }
        }
    }
}