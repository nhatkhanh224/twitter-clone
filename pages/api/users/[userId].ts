import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const existingUser = await axios.get(`${process.env.apiURL}/users/${userId}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });

    const followersCount = await axios.get(`${process.env.apiURL}/users/follow/count/${userId}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });
    return res.status(200).json({ ...existingUser, followersCount });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
