import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { response } from "express";
import mongoose from "mongoose";
import { getSocketId, io } from "../socket/socket.js";

export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file?.path;
        const authorId = req.userId;
        if (!image) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Image is required")
            )
        }
        //although we are optimizing image on cloudinary but we can optimize on server using Sharp .
        const response = await uploadOnCloudinary(image);
        if (!response.url) {
            console.log("failed to upload image on cloudinary")
            return res.status(500).json(new ApiResponse(500, {}, "Image upload failed"));
        }
        const post = await Post.create({
            caption,
            image: {
                url: response.secure_url,
                publicId: response.public_id
            },
            author: authorId
        })
        const user = await User.findById(authorId)
        if (user) {
            user.posts.push(post._id);
            await user.save()
        }
        await post.populate({ path: "author", select: "username profilePicUrl" })
        return res.status(201).json(
            new ApiResponse(201, post, "New Post Created")
        )
    } catch (error) {
        console.log("Error in creating Post", error)
        if (response) await deleteFromCloudinary(response.public_id)
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePic" })
            .populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePic" } })

        return res.status(200).json(
            new ApiResponse(200, posts, "All Posts fetched")
        )
    } catch (error) {
        console.log("Error in fetching all posts", error)
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.userId;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username, profilePicUrl" })
            .populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username, profilePicUrl" } })

        return res.status(200).json(
            new ApiResponse(200, posts, "User Post fetched Successfully")
        )
    } catch (error) {
        console.log("Error in getting user Post", error)

    }
}

export const likeDislikePost = async (req, res) => {
    try {
        const authorId = req.userId;
        const postId = req.params.id;
        const post = await Post.findById(postId).select("author");
        if (!post) return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
        const alreadyLiked = await Post.exists({ _id: postId, likes: authorId });
        const user = await User.findById(authorId).select("profilePicUrl username").lean();
        const postOwnerId = post.author.toString();
        if (alreadyLiked) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: authorId } });
            if (postOwnerId !== authorId) {
                const notification = {
                    type: "dislike",
                    userId: authorId,
                    userDetails: user,
                    postId,
                    message: "Your Post was dislike"
                }
                const postOwnerSocketId = getSocketId(postOwnerId);
                if (postOwnerSocketId) {
                    io.to(postOwnerSocketId).emit('notification', notification)
                }

            }
            return res.status(200).json(new ApiResponse(200, {}, "Post Disliked"))
        }
        await Post.updateOne({ _id: postId }, { $addToSet: { likes: authorId } });
        if (postOwnerId !== authorId) {
            const notification = {
                type: "like",
                userId: authorId,
                userDetails: user,
                postId,
                message: "Your Post was liked"

            }
            const postOwnerSocketId = getSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification)
                console.log("liked")
            }
        }
        return res.status(200).json(new ApiResponse(200, {}, "Post Liked"))
    } catch (error) {
        console.log("Error in Like Post", error);
        return res.status(500).json(new ApiResponse(500, null, "Like toggle failed"))
    }
}

export const addComment = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        })
        await comment.populate("author", "username profilePicUrl")
        post.comments.push(comment._id)
        await post.save();

        return res.status(201).json(new ApiResponse(201, comment, "Comment added"))
    } catch (error) {
        console.log("Error in adding comments", error);
    }
}

export const getAllCommentsOfPost = async (req, res) => {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 }).populate("author", "username profilePicUrl")
    if (!comments) return res.status(404).json(new ApiResponse(404, {}, "comments not found"))
    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched."))
}

export const deletePost = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const postId = req.params.id;
        const authorId = req.userId;
        const post = await Post.findById(postId).select("author image").session(session)
        if (!post) {
            await session.abortTransaction();
            return res.status(404).json(new ApiResponse(404, {}, "post not found"));
        }
        // check whether the logged in user owns the post
        if (post.author.toString() !== authorId) {
            await session.abortTransaction();
            return res.status(403).json(new ApiResponse(403, {}, "Access Denied"));
        }
        const publicId = post.image?.publicId;
        // we have to delete post from users also
        await Post.findByIdAndDelete(postId).session(session)
        await User.updateOne(
            { _id: authorId },
            { $pull: { posts: postId } }
        ).session(session);
        //then delete the comments of the post
        await Comment.deleteMany({ post: postId }).session(session);
        await session.commitTransaction()
        session.endSession()
        if (publicId) {
            await deleteFromCloudinary(publicId)
        }
        return res.status(200).json(new ApiResponse(200, {}, "Post deleted"))
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in delete Post", error)
    }

}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.userId;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json(new ApiResponse(404, {}, "post not found"));
        const user = await User.findById(authorId);
        if (user.bookmark.includes(postId)) {
            //already bookmarked so i have to remove from bookmark
            await user.updateOne({ $pull: { bookmark: post._id } });
            return res.status(200).json(new ApiResponse(200, {}, "post removed from bookmark"))
        } else {
            await user.updateOne({ $addToSet: { bookmark: post._id } });
            return res.status(200).json(new ApiResponse(200, {}, "post Bookmarked"))
        }
    } catch (error) {
        console.log("Error in bookmark post", error)
    }
}
