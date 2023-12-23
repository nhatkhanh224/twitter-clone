import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import axios from "axios";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }
  
  try {
    const { userId } = req.body;

    const { currentUser } = await serverAuth(req, res);

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const user = await axios.get(`${process.env.apiURL}/users/follow/${userId}`)
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          console.log(error);
        });
    if (!user) {
      throw new Error('Invalid ID');
    }
    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === 'POST') {
      updatedFollowingIds.push(userId);

      // NOTIFICATION PART START
      try {
        await axios.post(`${process.env.apiURL}/notifications`, {
          body: 'Someone followed you!',
          userId,
          createdAt: moment().format(),
          updateAt: moment().format(),
        });

        await axios.put(`${process.env.apiURL}/users/updateProfile`, {
          id: userId,
          hasNotification: true
        });
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END

    }

    if (req.method === 'DELETE') {
      updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== userId);
    }
    
    const updatedUser = await axios.put(`${process.env.apiURL}/users/updateProfile`, {
      id: currentUser._id,
      followingIds: updatedFollowingIds
    });
    return res.status(200).json(updatedUser.statusText);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}