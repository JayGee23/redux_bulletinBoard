import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, getPostsError, getPostsStatus, selectAllPosts } from "./postsSlice";
import { useEffect, useRef } from "react";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
    const dispatch = useDispatch()

    const posts = useSelector(selectAllPosts)
    const postsStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    const effectRan = useRef(false)

    useEffect(() => {
        
        if(postsStatus === 'idle' && effectRan.current === false) {
            dispatch(fetchPosts())

           return () => {
                effectRan.current = true
            }
        } 
        

    }, [postsStatus, dispatch])

    let content
    if(postsStatus === 'loading') {
        content = <p>"Loading...."</p>
    } else if(postsStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPosts.map( post => <PostsExcerpt key={post.id} post={post} />)
    } else if(postsStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}

export default PostsList