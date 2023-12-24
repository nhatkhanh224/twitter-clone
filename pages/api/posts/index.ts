import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import axios from "axios";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {

    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;
      const post = await axios.post(`${process.env.apiURL}/posts/createPost`, {
        body,
        userId: currentUser._id,
        createdAt: moment().format(),
        updateAt: moment().format(),
      }).then(function (response) {
        return response.data
      })
        .catch(function (error) {
          console.log(error);
        });

      return res.status(200).json(post);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;


      let posts;

      if (userId && typeof userId === 'string') {
        posts = await axios.post(`${process.env.apiURL}/posts/findPostByUserID`, {
          userId,
        }).then(function (response) {
          return response.data
        })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        posts = await axios.post(`${process.env.apiURL}/posts/findPostByUserID`, {
          userId: null,
        }).then(function (response) {
          return response.data
        })
          .catch(function (error) {
            console.log(error);
          });
      }
      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}