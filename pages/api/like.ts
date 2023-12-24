import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import axios from "axios";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    const { currentUser } = await serverAuth(req, res);

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    // const post = await prisma.post.findUnique({
    //   where: {
    //     id: postId
    //   }
    // });
    const post = await axios.post(`${process.env.apiURL}/posts/findPostByID`, {
      postId,
    }).then(function (response) {
      return response.data
    })
      .catch(function (error) {
        console.log(error);
      });

    if (!post) {
      throw new Error('Invalid ID');
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (req.method === 'POST') {
      updatedLikedIds.push(currentUser._id);

      // NOTIFICATION PART START
      try {
        const post = await axios.post(`${process.env.apiURL}/posts/findPostByID`, {
          postId,
        }).then(function (response) {
          return response.data
        })
          .catch(function (error) {
            console.log(error);
          });
        if (post?.userId) {
          await axios.post(`${process.env.apiURL}/notifications`, {
            body: 'Someone replied on your tweet!',
            userId: post.userId,
            createdAt: moment().format(),
            updateAt: moment().format(),
          });
          await axios.put(`${process.env.apiURL}/users/updateProfile`, {
            id: post.userId,
            hasNotification: true
          });
        }
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
    }

    if (req.method === 'DELETE') {
      updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser?._id);
    }

    // const updatedPost = await prisma.post.update({
    //   where: {
    //     id: postId
    //   },
    //   data: {
    //     likedIds: updatedLikedIds
    //   }
    // });

    const updatedPost = await axios.put(`${process.env.apiURL}/posts/updatePost`, {
      postId,
      likedIds: updatedLikedIds,
      updateAt: moment().format(),
    }).then(function (response) {
      return response.data
    })
      .catch(function (error) {
        console.log(error);
      });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}