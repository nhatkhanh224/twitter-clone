import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    // const post = await prisma.post.findUnique({
    //   where: {
    //     id: postId,
    //   },
    //   include: {
    //     user: true,
    //     comments: {
    //       include: {
    //         user: true
    //       },
    //       orderBy: {
    //         createdAt: 'desc'
    //       }
    //     },
    //   },
    // });

    const post = await axios.post('http://localhost:3000/posts/findPostByID', {
      postId,
    });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
