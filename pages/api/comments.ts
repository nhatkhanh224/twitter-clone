import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import axios from "axios";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { body } = req.body;
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    // const comment = await prisma.comment.create({
    //   data: {
    //     body,
    //     userId: currentUser._id,
    //     postId
    //   }
    // });

    const comment = await axios.post(`${process.env.apiURL}/comments`, {
      body,
      userId: currentUser._id,
      postId,
      createdAt: moment().format(),
      updateAt: moment().format(),
    }).then(function (response) {
      return response.data
    })
      .catch(function (error) {
        console.log(error);
      });

    // NOTIFICATION PART START
    try {
      // const post = await prisma.post.findUnique({
      //   where: {
      //     id: postId,
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

      if (post?.userId) {
        // await prisma.notification.create({
        //   data: {
        //     body: 'Someone replied on your tweet!',
        //     userId: post.userId
        //   }
        // });
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
        // await prisma.user.update({
        //   where: {
        //     id: post.userId
        //   },
        //   data: {
        //     hasNotification: true
        //   }
        // });
      }
    }
    catch (error) {
      console.log(error);
    }
    // NOTIFICATION PART END

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}