import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import jwt from "jsonwebtoken"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //we have to validate data -> TOdo

        const existedUser = await User.exists({ email, username })
        if (existedUser) {
            return res.status(409).json(
                new ApiResponse(409, {}, "User Already Exists")
            )
        }

        const user = await User.create({
            username,
            email,
            password
        })

        return res.status(201).json(
            new ApiResponse(201, {
                id: user._id
            },
                "User created Successfully"
            )
        )
    } catch (error) {
        console.log("Error in registering User ❌", error)
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User not Found")
            )
        }

        const isPasswordValid = await existingUser.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Invalid credentials")
            )
        }
        const token = jwt.sign({
            userId: existingUser._id
        },
            process.env.TOKEN_SECRET_KEY,
            {
                expiresIn: "1d"
            })

        const options = {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1 * 24 * 60 * 60 * 1000
        }
        const loggedInUser = await User.findById(existingUser._id).select("-password");

        return res
            .cookie("token", token, options)
            .json(
                new ApiResponse(200, loggedInUser, `Welcome ${loggedInUser.username}`)
            )
    } catch (error) {
        console.log("Error in loggin User❌", error)
    }
}

export const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1 * 24 * 60 * 60 * 1000
        }
        res.status(200)
            .clearCookie("token", options)
            .json(new ApiResponse(200, {}, "Logout Successfully"))
    } catch (error) {
        console.log("Error in logout User❌", error)
    }

}

export const getUserProfile = async (req, res) => {
    const username = req.params.id;
    const user = await User.findOne({ username }).populate({ path: "posts", sort: { createdAt: -1 } }).populate({ path: "bookmark", sort: { createdAt: -1 } }).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "User fetched Successfully"))
}

export const editProfile = async (req, res) => {
    try {
        const { username, bio, gender } = req.body;
        const profilePicPath = req.file?.path;
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, null, "User not found")
            );
        }

        let updated = false;
        if (username && username !== user.username) {
            const exists = await User.exists({ username });

            if (exists) {
                return res.status(409).json(
                    new ApiResponse(409, null, "Username already taken")
                );
            }

            user.username = username.trim();
            updated = true;
        }

        if (profilePicPath) {
            const uploaded = await uploadOnCloudinary(profilePicPath);

            if (!uploaded?.url) {
                return res.status(500).json(
                    new ApiResponse(500, null, "Image upload failed")
                );
            }

            const oldPublicId = user.profilePic?.publicId;

            user.profilePic = {
                url: uploaded.url,
                publicId: uploaded.public_id,
            };

            updated = true;

            if (oldPublicId) {
                await deleteFromCloudinary(oldPublicId).catch(() => { });
            }
        }


        if (typeof bio === "string" && bio !== user.bio) {
            user.bio = bio.trim();
            updated = true;
        }

        const allowedGender = ["male", "female", "other"];

        if (gender && allowedGender.includes(gender)) {
            user.gender = gender;
            updated = true;
        }

        if (!updated) {
            return res.status(200).json(
                new ApiResponse(200, user, "Failed to update Profile")
            );
        }

        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user, "Profile Updated")
        )
    } catch (error) {
        console.log("Error in updating Profile", error)
        return res.status(500).json(
            new ApiResponse(500, {}, error.message))
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select("-password")
        if (!users) {
            return res.status(404).json(
                new ApiResponse(404, {}, "No suggested User")
            )
        }
        return res.status(200).json(
            new ApiResponse(200, users, "Suggested User fetched")
        )

    } catch (error) {
        console.log("error in getSuggested USer", error)
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const whoIsFollowing = req.userId;
        const whoIsFollowed = req.params.id;
        if (whoIsFollowing.toString() === whoIsFollowed) {
            return res.status(400).json(
                new ApiResponse(400, {}, "You Cannot follow/unfollow yourself")
            )
        }

        const user = await User.findById(whoIsFollowing)
        const targetUser = await User.findById(whoIsFollowed)
        if (!user || !targetUser) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User not found")
            )
        }
        const isFollowing = user.following?.includes(whoIsFollowed);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: whoIsFollowing }, { $pull: { following: whoIsFollowed } }),
                User.updateOne({ _id: whoIsFollowed }, { $pull: { follower: whoIsFollowing } }),
            ])
            return res.status(200).json(
                new ApiResponse(200, {}, "Unfollowed Successfully")
            )
        } else {
            await Promise.all([
                User.updateOne({ _id: whoIsFollowing }, { $push: { following: whoIsFollowed } }),
                User.updateOne({ _id: whoIsFollowed }, { $push: { follower: whoIsFollowing } }),
            ])
            return res.status(200).json(
                new ApiResponse(200, {}, "followed Successfully")
            )
        }


    } catch (error) {
        console.log("Error in FolloworUnfollow ", error)
    }
}