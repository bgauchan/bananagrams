import db from '../firebase'

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const MARK_POST_AS_READ = 'MARK_POST_AS_READ'
export const REQUEST_READ_POSTS = 'REQUEST_READ_POSTS'
export const RECEIVE_READ_POSTS = 'RECEIVE_READ_POSTS'

const readPostsDoc = db.collection("readPosts").doc('all')

export function selectSubreddit(subreddit) {
    return { type: SELECT_SUBREDDIT, subreddit }
}

export function invalidateSubreddit(subreddit) {
    return { type: INVALIDATE_SUBREDDIT, subreddit}
}

function postRead(postID) {
    return {
        type: MARK_POST_AS_READ,
        postID
    }
}

export function markPostAsRead(postID) {
    return (dispatch, getState) => {
        let state = getState()
        let readPosts = state.readPosts

        // post already exists in state, then ignore it bcoz
        // it means, it was read already
        if(readPosts.includes(postID)) {
            return
        }

        readPostsDoc.set({
            ids: [...readPosts, postID]
        })
        .then(() => {
            dispatch(postRead(postID))
            console.log('Firebase: succesfully updated readPosts')
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}

function requestReadPosts(subreddit) {
    return { type: REQUEST_READ_POSTS, subreddit }
}

function receiveReadPosts(subreddit, data) {
    return {
        type: RECEIVE_READ_POSTS,
        subreddit,
        ids: data.ids,
        receivedAt: Date.now()
    }
}

export function fetchReadPosts(subreddit) {
    return function(dispatch) {
        dispatch(requestReadPosts(subreddit))

        return (
            readPostsDoc.get().then((doc) => {
                if (doc.exists) {
                    dispatch(receiveReadPosts(subreddit, doc.data()))
                } else {
                    console.log("No such document!")
                }
            }).catch((error) => console.log("Error getting document:", error))
        )
    }
}

function requestPosts(subreddit) {
    return { type: REQUEST_POSTS, subreddit }
}

function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

function fetchPosts(subreddit) {
    return function(dispatch) {
        dispatch(requestPosts(subreddit))

        return (
            fetch(`https://www.reddit.com/r/${subreddit}.json?limit=25`)
            .then(res => res.json())
            .then(json => dispatch(receivePosts(subreddit, json)))
        )
    }
}

function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]

    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {
    // This is useful for avoiding a network request if
    // a cached value is already available.
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {         
            console.log('fetching posts...')
            return dispatch(fetchPosts(subreddit))
        } else {
            console.log('no need to fetch')
            return Promise.resolve()
        }
    }
}